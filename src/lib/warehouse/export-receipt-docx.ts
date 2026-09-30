import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  Packer,
  PageOrientation,
  Paragraph,
  Tab,
  TabStopType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  VerticalMergeType,
  WidthType,
} from "docx";
import { formatNumber } from "./format";
import { receiptTotal } from "./selectors";
import type { Material, Receipt, Warehouse } from "./types";

const FONT = "Times New Roman";
const SIZE = 22; // 11pt

// Khổ A4 đứng: Chiều rộng 11906 dxa, lề trái/phải 1134 dxa (~2cm) -> TOTAL_W = 9638 dxa (~10000)
const COLS = [500, 2938, 1200, 800, 1000, 1000, 1100, 1100]; // Tổng = 9638 dxa
const TOTAL_W = COLS.reduce((a, b) => a + b, 0);
const MIN_ROWS = 3;

// ── Đọc số tiền bằng chữ ─────────────────────────────────────────────────
const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function readTriple(n: number, full: boolean): string {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const dv = n % 10;
  const parts: string[] = [];
  if (tram > 0 || full) parts.push(`${DIGITS[tram]} trăm`);
  if (chuc > 1) {
    parts.push(`${DIGITS[chuc]} mươi`);
    if (dv === 1) parts.push("mốt");
    else if (dv === 5) parts.push("lăm");
    else if (dv > 0) parts.push(DIGITS[dv]);
  } else if (chuc === 1) {
    parts.push("mười");
    if (dv === 5) parts.push("lăm");
    else if (dv > 0) parts.push(DIGITS[dv]);
  } else if (dv > 0) {
    if (tram > 0 || full) parts.push("lẻ");
    parts.push(DIGITS[dv]);
  }
  return parts.join(" ");
}

function readBelowBillion(n: number, afterHigher: boolean): string {
  const units = ["", "nghìn", "triệu"];
  const groups: number[] = [];
  for (let x = n; x > 0; x = Math.floor(x / 1000)) groups.push(x % 1000);
  const out: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const full = afterHigher || i < groups.length - 1;
    out.push(readTriple(groups[i], full) + (units[i] ? ` ${units[i]}` : ""));
  }
  return out.join(" ");
}

function readNumber(n: number): string {
  if (n >= 1e9) {
    const rest = n % 1e9;
    return `${readNumber(Math.floor(n / 1e9))} tỷ${rest ? ` ${readBelowBillion(rest, true)}` : ""}`;
  }
  return readBelowBillion(n, false);
}

export function moneyToWords(value: number): string {
  const n = Math.round(Math.abs(value));
  if (n === 0) return "Không đồng chẵn.";
  const text = `${readNumber(n)} đồng chẵn.`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ── Helper dựng docx ─────────────────────────────────────────────────────
type Align = (typeof AlignmentType)[keyof typeof AlignmentType];

const run = (text: string, o: { bold?: boolean; italics?: boolean; size?: number } = {}) =>
  new TextRun({ text, font: FONT, size: o.size ?? SIZE, bold: o.bold, italics: o.italics });

const dots = (n: number) => ".".repeat(n);

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = {
  top: NONE,
  bottom: NONE,
  left: NONE,
  right: NONE,
  insideHorizontal: NONE,
  insideVertical: NONE,
};

function line(children: TextRun[], o: { dotted?: boolean; align?: Align; after?: number } = {}) {
  return new Paragraph({
    alignment: o.align,
    spacing: { after: o.after ?? 60 },
    border: o.dotted
      ? { bottom: { style: BorderStyle.DOTTED, size: 6, space: 1, color: "000000" } }
      : undefined,
    children,
  });
}

function plainCell(width: number, paragraphs: Paragraph[]) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    children: paragraphs,
  });
}

type CellOpts = {
  width: number;
  align?: Align;
  bold?: boolean;
  italics?: boolean;
  span?: number;
  vMerge?: "restart" | "continue";
};

function cell(text: string, o: CellOpts) {
  return new TableCell({
    width: { size: o.width, type: WidthType.DXA },
    columnSpan: o.span,
    verticalMerge:
      o.vMerge === "restart"
        ? VerticalMergeType.RESTART
        : o.vMerge === "continue"
          ? VerticalMergeType.CONTINUE
          : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 60, right: 60 },
    children: [
      new Paragraph({
        alignment: o.align ?? AlignmentType.CENTER,
        children: [run(text, { bold: o.bold, italics: o.italics })],
      }),
    ],
  });
}

function row(cells: TableCell[], minHeight = 380) {
  return new TableRow({ height: { value: minHeight, rule: HeightRule.ATLEAST }, children: cells });
}

// ── Xuất phiếu ───────────────────────────────────────────────────────────
export async function exportReceiptDocx(
  receipt: Receipt,
  materials: Material[],
  warehouses: Warehouse[],
) {
  const matById = new Map(materials.map((m) => [m.id, m]));
  const wh = warehouses.find((w) => w.name === receipt.warehouse);
  const [y = "", m = "", d = ""] = receipt.date.split("-");
  const total = receiptTotal(receipt.lines);
  const [cSTT, cName, cSku, cUnit, cDoc, cReal, cPrice, cAmount] = COLS;
  const C = AlignmentType.CENTER;
  const L = AlignmentType.LEFT;
  const R = AlignmentType.RIGHT;

  // Đầu phiếu: đơn vị / mẫu số
  const header = new Table({
    width: { size: TOTAL_W, type: WidthType.DXA },
    columnWidths: [4300, 5338],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          plainCell(4300, [
            line([run(`Đơn vị:${dots(15)}`, { bold: true })], { after: 20 }),
            line([run(`Bộ phận:${dots(13)}`, { bold: true })]),
          ]),
          plainCell(5338, [
            line([run("Mẫu số 01 - VT", { bold: true })], { align: C, after: 20 }),
            line([run("(Ban hành theo Thông tư số 133/2016/TT-BTC", { bold: true, italics: true, size: 20 })], { align: C, after: 0 }),
            line([run("Ngày 26/8/2016 của Bộ Tài chính)", { bold: true, italics: true, size: 20 })], { align: C }),
          ]),
        ],
      }),
    ],
  });

  const title = line([run("PHIẾU NHẬP KHO", { bold: true, size: 30 })], { align: C, after: 40 });

  // Ngày / Số — Nợ / Có
  const sub = new Table({
    width: { size: TOTAL_W, type: WidthType.DXA },
    columnWidths: [3200, 3238, 3200],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          plainCell(3200, [line([])]),
          plainCell(3238, [
            line([run(`Ngày ${d} tháng ${m} năm ${y}`, { italics: true })], { after: 20, align: C }),
            line([run(`Số: ${receipt.code}`, { italics: true })], { align: C }),
          ]),
          plainCell(3200, [
            line([run(`Nợ: ${dots(15)}`, { italics: true })], { after: 20 }),
            line([run(`Có: ${dots(15)}`, { italics: true })]),
          ]),
        ],
      }),
    ],
  });

  const info = [
    line([run("- Họ và tên người giao: ")], { dotted: true }),
    line(
      [
        run(
          `- Theo ${dots(12)} số ${dots(8)} ngày ${dots(5)} tháng ${dots(5)} năm ${dots(6)} của ${receipt.supplier}`,
        ),
      ],
      { dotted: true },
    ),
    new Paragraph({
      spacing: { after: 120 },
      tabStops: [{ type: TabStopType.LEFT, position: 5500 }],
      border: { bottom: { style: BorderStyle.DOTTED, size: 6, space: 1, color: "000000" } },
      children: [
        run(`Nhập tại kho: ${receipt.warehouse}`),
        new TextRun({ children: [new Tab(), `địa điểm: ${wh?.address ?? ""}`], font: FONT, size: SIZE }),
      ],
    }),
  ];

  // Bảng vật tư
  const head1 = row([
    cell("STT", { width: cSTT, bold: true, vMerge: "restart" }),
    cell("Tên, nhãn hiệu, quy cách vật tư", { width: cName, bold: true, vMerge: "restart" }),
    cell("Mã số", { width: cSku, bold: true, vMerge: "restart" }),
    cell("ĐVT", { width: cUnit, bold: true, vMerge: "restart" }),
    cell("Số lượng", { width: cDoc + cReal, bold: true, span: 2 }),
    cell("Đơn giá", { width: cPrice, bold: true, vMerge: "restart" }),
    cell("Thành tiền", { width: cAmount, bold: true, vMerge: "restart" }),
  ]);
  const head2 = row([
    cell("", { width: cSTT, vMerge: "continue" }),
    cell("", { width: cName, vMerge: "continue" }),
    cell("", { width: cSku, vMerge: "continue" }),
    cell("", { width: cUnit, vMerge: "continue" }),
    cell("Chứng từ", { width: cDoc, bold: true }),
    cell("Thực nhập", { width: cReal, bold: true }),
    cell("", { width: cPrice, vMerge: "continue" }),
    cell("", { width: cAmount, vMerge: "continue" }),
  ]);
  const head3 = row(
    ["A", "B", "C", "D", "1", "2", "3", "4"].map((t, i) => cell(t, { width: COLS[i] })),
    300,
  );

  const dataRows = receipt.lines.map((ln, i) => {
    const mat = matById.get(ln.materialId);
    const name = mat ? (mat.note ? `${mat.name}, ${mat.note}` : mat.name) : "";
    return row([
      cell(String(i + 1), { width: cSTT }),
      cell(name, { width: cName, align: L }),
      cell(mat?.sku ?? "", { width: cSku }),
      cell(mat?.unit ?? "", { width: cUnit }),
      cell("", { width: cDoc }), // Theo chứng từ
      cell(formatNumber(ln.quantity), { width: cReal, align: R }),
      cell(formatNumber(ln.unitPrice), { width: cPrice, align: R }),
      cell(formatNumber(ln.quantity * ln.unitPrice), { width: cAmount, align: R }),
    ]);
  });
  const blankRows = Array.from({ length: Math.max(0, MIN_ROWS - dataRows.length) }, () =>
    row(COLS.map((w) => cell("", { width: w }))),
  );
  const sumRow = row([
    cell("", { width: cSTT }),
    cell("Cộng", { width: cName, bold: true, align: L }),
    cell("x", { width: cSku, bold: true }),
    cell("x", { width: cUnit, bold: true }),
    cell("x", { width: cDoc, bold: true }),
    cell("x", { width: cReal, bold: true }),
    cell("x", { width: cPrice, bold: true }),
    cell(formatNumber(total), { width: cAmount, bold: true, align: R }),
  ]);

  const itemsTable = new Table({
    width: { size: TOTAL_W, type: WidthType.DXA },
    columnWidths: COLS,
    layout: TableLayoutType.FIXED,
    rows: [head1, head2, head3, ...dataRows, ...blankRows, sumRow],
  });

  const footer = [
    new Paragraph({ spacing: { before: 120 }, children: [] }),
    line([run(`- Tổng số tiền (viết bằng chữ): ${moneyToWords(total)}`)], { dotted: true }),
    line([run("- Số chứng từ gốc kèm theo: ")], { dotted: true, after: 160 }),
  ];

  const colSignW = Math.floor(TOTAL_W / 4); // 2409 dxa mỗi cột chữ ký
  const sign = (title: string, sub: string) =>
    plainCell(colSignW, [
      line([run(title, { bold: true })], { align: C, after: 0 }),
      line([run(sub, { italics: true, size: 20 })], { align: C, after: 1200 }),
    ]);

  const signatures = new Table({
    width: { size: TOTAL_W, type: WidthType.DXA },
    columnWidths: [colSignW, colSignW, colSignW, colSignW],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          sign("Người lập phiếu", "(Ký, họ tên)"),
          sign("Người giao hàng", "(Ký, họ tên)"),
          sign("Thủ kho", "(Ký, họ tên)"),
          sign("Kế toán trưởng", "(Ký, họ tên)"),
        ],
      }),
    ],
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.PORTRAIT, width: 11906, height: 16838 },
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // Lề 2cm mỗi bên
          },
        },
        children: [header, title, sub, new Paragraph({ children: [] }), ...info, itemsTable, ...footer, signatures],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Phieu-nhap-kho-${receipt.code}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
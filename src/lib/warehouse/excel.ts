import type { MaterialImportRow } from "./types";

type ZipEntry = {
  name: string;
  method: number;
  compressedSize: number;
  localOffset: number;
};

function u16(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

function u32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

function findEndOfCentralDirectory(view: DataView) {
  const start = Math.max(0, view.byteLength - 65_557);
  for (let offset = view.byteLength - 22; offset >= start; offset -= 1) {
    if (u32(view, offset) === 0x06054b50) return offset;
  }
  throw new Error("File Excel không hợp lệ hoặc không phải .xlsx.");
}

function readZipEntries(buffer: ArrayBuffer): ZipEntry[] {
  const view = new DataView(buffer);
  const eocd = findEndOfCentralDirectory(view);
  const count = u16(view, eocd + 10);
  const centralSize = u32(view, eocd + 12);
  const centralOffset = u32(view, eocd + 16);
  if (centralOffset + centralSize > view.byteLength) {
    throw new Error("File Excel bị hỏng.");
  }

  const decoder = new TextDecoder();
  const entries: ZipEntry[] = [];
  let offset = centralOffset;

  for (let i = 0; i < count; i += 1) {
    if (u32(view, offset) !== 0x02014b50) {
      throw new Error("Không đọc được cấu trúc file Excel.");
    }

    const flags = u16(view, offset + 8);
    const method = u16(view, offset + 10);
    const compressedSize = u32(view, offset + 20);
    const nameLength = u16(view, offset + 28);
    const extraLength = u16(view, offset + 30);
    const commentLength = u16(view, offset + 32);
    const localOffset = u32(view, offset + 42);
    const nameBytes = new Uint8Array(buffer, offset + 46, nameLength);
    const name = decoder.decode(nameBytes);

    entries.push({ name, method, compressedSize, localOffset });
    offset += 46 + nameLength + extraLength + commentLength;

    // ZIP64 files are not expected for normal material lists.
    if ((flags & 0x0001) !== 0) {
      throw new Error("File Excel đang được mã hóa, không thể đọc.");
    }
  }

  return entries;
}

async function readZipEntry(buffer: ArrayBuffer, entry: ZipEntry): Promise<Uint8Array> {
  const view = new DataView(buffer);
  const offset = entry.localOffset;
  if (u32(view, offset) !== 0x04034b50) {
    throw new Error("Không đọc được dữ liệu trong file Excel.");
  }

  const nameLength = u16(view, offset + 26);
  const extraLength = u16(view, offset + 28);
  const dataStart = offset + 30 + nameLength + extraLength;
  const compressed = new Uint8Array(buffer, dataStart, entry.compressedSize);

  if (entry.method === 0) return new Uint8Array(compressed);
  if (entry.method !== 8) {
    throw new Error("File Excel dùng kiểu nén chưa được hỗ trợ.");
  }

  if (typeof DecompressionStream === "undefined") {
    throw new Error("Trình duyệt này chưa hỗ trợ đọc file Excel .xlsx.");
  }

  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function parseXml(bytes: Uint8Array): Document {
  const text = new TextDecoder().decode(bytes);
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Không đọc được dữ liệu XML trong file Excel.");
  }
  return doc;
}

function normalizeTarget(target: string) {
  const value = target.replaceAll("\\", "/").replace(/^\/+/, "").replace(/^\.\//, "");
  if (value.startsWith("xl/")) return value;
  return `xl/${value}`;
}

function cellColumn(ref: string) {
  const letters = ref.match(/^[A-Z]+/i)?.[0] ?? "";
  let result = 0;
  for (const char of letters.toUpperCase()) {
    result = result * 26 + char.charCodeAt(0) - 64;
  }
  return result - 1;
}

function cellValue(cell: Element, sharedStrings: string[]) {
  const type = cell.getAttribute("t");
  const value = cell.querySelector("v")?.textContent ?? "";

  if (type === "s") {
    const index = Number(value);
    return sharedStrings[index] ?? "";
  }

  if (type === "inlineStr") {
    return cell.querySelector("is")?.textContent?.trim() ?? "";
  }

  if (type === "b") return value === "1";
  return value.trim();
}

function parseSharedStrings(doc: Document) {
  return [...doc.getElementsByTagName("si")].map((item) =>
    [...item.getElementsByTagName("t")].map((node) => node.textContent ?? "").join(""),
  );
}

async function parseWorkbook(buffer: ArrayBuffer) {
  const entries = readZipEntries(buffer);
  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  const get = async (name: string) => {
    const entry = byName.get(name);
    if (!entry) throw new Error(`Không tìm thấy thành phần ${name} trong file Excel.`);
    return readZipEntry(buffer, entry);
  };

  let sharedStrings: string[] = [];
  if (byName.has("xl/sharedStrings.xml")) {
    sharedStrings = parseSharedStrings(parseXml(await get("xl/sharedStrings.xml")));
  }

  let sheetPath = "xl/worksheets/sheet1.xml";
  if (byName.has("xl/workbook.xml") && byName.has("xl/_rels/workbook.xml.rels")) {
    const workbook = parseXml(await get("xl/workbook.xml"));
    const firstSheet = workbook.getElementsByTagName("sheet")[0];
    const relationshipId = firstSheet?.getAttribute("r:id");
    if (relationshipId) {
      const rels = parseXml(await get("xl/_rels/workbook.xml.rels"));
      const relationship = [...rels.getElementsByTagName("Relationship")].find(
        (item) => item.getAttribute("Id") === relationshipId,
      );
      const target = relationship?.getAttribute("Target");
      if (target) sheetPath = normalizeTarget(target);
    }
  }

  const sheet = parseXml(await get(sheetPath));
  const rows = [...sheet.getElementsByTagName("row")].map((row) => {
    const values: string[] = [];
    for (const cell of [...row.getElementsByTagName("c")]) {
      const ref = cell.getAttribute("r") ?? "";
      const column = cellColumn(ref);
      if (column < 0) continue;
      values[column] = String(cellValue(cell, sharedStrings));
    }
    return values;
  });

  return rows;
}

function parseDelimited(text: string) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === delimiter && !quoted) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}

function findHeader(headers: string[], aliases: string[]) {
  return headers.findIndex((header) => {
    const normalized = header
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "");
    return aliases.includes(normalized);
  });
}

function toQuantity(value: string) {
  const normalized = value.trim().replace(/,/g, ".");
  const match = normalized.replace(/[^0-9.+-]/g, "");
  const quantity = Number(match);
  return Number.isFinite(quantity) ? quantity : 0;
}

function rowsToMaterials(rows: string[][]): MaterialImportRow[] {
  const nonEmptyRows = rows.filter((row) => row.some((cell) => String(cell ?? "").trim()));
  if (!nonEmptyRows.length) return [];

  const headerIndex = nonEmptyRows.findIndex((row) => {
    const normalized = row.map((cell) =>
      String(cell ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\\u0300-\\u036f]/g, ""),
    );
    return (
      normalized.some((value) => ["ma hang", "ma vat tu", "sku"].includes(value)) &&
      normalized.some((value) => ["ten hang", "ten vat tu", "name"].includes(value))
    );
  });

  if (headerIndex < 0) {
    throw new Error("Không tìm thấy dòng tiêu đề. File cần có các cột Mã hàng, Tên hàng, ĐVT và Số lượng.");
  }

  const headers = nonEmptyRows[headerIndex].map((cell) => String(cell ?? ""));
  const skuColumn = findHeader(headers, ["ma hang", "ma vat tu", "sku", "ma"]);
  const nameColumn = findHeader(headers, ["ten hang", "ten vat tu", "name", "ten"]);
  const unitColumn = findHeader(headers, ["dvt", "don vi", "don vi tinh", "unit"]);
  const quantityColumn = findHeader(headers, ["so luong", "sl", "quantity", "qty"]);

  if (skuColumn < 0 || nameColumn < 0) {
    throw new Error("File Excel phải có ít nhất cột Mã hàng và Tên hàng.");
  }

  return nonEmptyRows.slice(headerIndex + 1).flatMap((row) => {
    const sku = String(row[skuColumn] ?? "").trim();
    const name = String(row[nameColumn] ?? "").trim();
    const unit = unitColumn >= 0 ? String(row[unitColumn] ?? "").trim() : "";
    const quantity = quantityColumn >= 0 ? toQuantity(String(row[quantityColumn] ?? "")) : 0;

    // Ignore repeated headers, note-only rows and completely empty material rows.
    if (!sku && !name) return [];
    if (sku.toLowerCase() === "mã hàng" || name.toLowerCase() === "tên hàng") return [];

    const needsReview = !sku || !name;
    return [{
      sku,
      name,
      unit,
      quantity,
      needsReview,
      warning: needsReview ? "Thiếu mã hoặc tên hàng." : "",
    }];
  });
}

export async function readMaterialExcel(file: File): Promise<MaterialImportRow[]> {
  const lowerName = file.name.toLowerCase();

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File quá lớn. Vui lòng chọn file Excel dưới 10 MB.");
  }

  if (lowerName.endsWith(".csv") || lowerName.endsWith(".txt")) {
    return rowsToMaterials(parseDelimited(await file.text()));
  }

  if (!lowerName.endsWith(".xlsx")) {
    throw new Error("Hiện hỗ trợ file .xlsx (Excel mới) hoặc .csv. File .xls cũ chưa được hỗ trợ.");
  }

  return rowsToMaterials(await parseWorkbook(await file.arrayBuffer()));
}

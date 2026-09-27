import type { Category, Material, Movement, Receipt, WarehouseData } from "./types";

const categories: Category[] = [
  { id: "cat_dien", name: "Vật liệu điện", description: "Dây điện, aptomat, ống luồn, đèn" },
  { id: "cat_nuoc", name: "Ống nước & phụ kiện", description: "Ống PVC, PPR, van, co, tê" },
  { id: "cat_dungcu", name: "Dụng cụ thi công", description: "Máy, kìm, thước, dao cắt" },
  { id: "cat_atld", name: "An toàn lao động", description: "Mũ, găng, giày, dây đai" },
  { id: "cat_tieuhao", name: "Vật tư tiêu hao", description: "Băng keo, đinh, keo, giấy nhám" },
  { id: "cat_kimloai", name: "Kim loại & bulong", description: "Thép, bulong, êcu, long đen" },
];

const materials: Material[] = [
  { id: "mat_cv25", sku: "DIEN-CV-25", name: "Dây điện CV 2.5mm", categoryId: "cat_dien", unit: "cuộn", minStock: 8, location: "Kệ A1", note: "Cadivi, 100m/cuộn", lastUnitPrice: 850000, createdAt: "2026-03-02T08:00:00.000Z" },
  { id: "mat_cv15", sku: "DIEN-CV-15", name: "Dây điện CV 1.5mm", categoryId: "cat_dien", unit: "cuộn", minStock: 10, location: "Kệ A1", note: "Cadivi, 100m/cuộn", lastUnitPrice: 560000, createdAt: "2026-03-02T08:00:00.000Z" },
  { id: "mat_mcb20", sku: "DIEN-MCB-20", name: "Aptomat 2P 20A", categoryId: "cat_dien", unit: "cái", minStock: 15, location: "Kệ A2", note: "Schneider", lastUnitPrice: 185000, createdAt: "2026-03-04T08:00:00.000Z" },
  { id: "mat_ong16", sku: "DIEN-ONG-16", name: "Ống luồn điện D16", categoryId: "cat_dien", unit: "cây", minStock: 40, location: "Kệ A3", note: "Sino, 2.9m", lastUnitPrice: 18000, createdAt: "2026-03-04T08:00:00.000Z" },
  { id: "mat_denled", sku: "DIEN-LED-18", name: "Đèn LED tuýp 1.2m 18W", categoryId: "cat_dien", unit: "cái", minStock: 20, location: "Kệ A4", note: "Rạng Đông", lastUnitPrice: 72000, createdAt: "2026-04-01T08:00:00.000Z" },
  { id: "mat_pvc21", sku: "NUOC-PVC-21", name: "Ống PVC D21", categoryId: "cat_nuoc", unit: "cây", minStock: 50, location: "Bãi B1", note: "Tiền Phong, 4.2m", lastUnitPrice: 45000, createdAt: "2026-03-06T08:00:00.000Z" },
  { id: "mat_pvc27", sku: "NUOC-PVC-27", name: "Ống PVC D27", categoryId: "cat_nuoc", unit: "cây", minStock: 30, location: "Bãi B1", note: "Tiền Phong, 4.2m", lastUnitPrice: 62000, createdAt: "2026-03-06T08:00:00.000Z" },
  { id: "mat_van21", sku: "NUOC-VAN-21", name: "Van khóa nước D21", categoryId: "cat_nuoc", unit: "cái", minStock: 20, location: "Kệ B2", note: "Miha", lastUnitPrice: 28000, createdAt: "2026-03-10T08:00:00.000Z" },
  { id: "mat_co21", sku: "NUOC-CO-21", name: "Co 90 độ PVC D21", categoryId: "cat_nuoc", unit: "cái", minStock: 40, location: "Kệ B2", note: "", lastUnitPrice: 3500, createdAt: "2026-03-10T08:00:00.000Z" },
  { id: "mat_ppr20", sku: "NUOC-PPR-20", name: "Ống PPR D20", categoryId: "cat_nuoc", unit: "cây", minStock: 20, location: "Bãi B3", note: "Wavin", lastUnitPrice: 89000, createdAt: "2026-04-12T08:00:00.000Z" },
  { id: "mat_khoan", sku: "DC-KHOAN-13", name: "Máy khoan pin 13mm", categoryId: "cat_dungcu", unit: "cái", minStock: 2, location: "Tủ C1", note: "Makita", lastUnitPrice: 2450000, createdAt: "2026-03-15T08:00:00.000Z" },
  { id: "mat_kim", sku: "DC-KIM-08", name: "Kìm cắt dây 8 inch", categoryId: "cat_dungcu", unit: "cái", minStock: 6, location: "Tủ C2", note: "", lastUnitPrice: 95000, createdAt: "2026-03-15T08:00:00.000Z" },
  { id: "mat_thuoc", sku: "DC-THUOC-5", name: "Thước kéo 5m", categoryId: "cat_dungcu", unit: "cái", minStock: 8, location: "Tủ C2", note: "Stanley", lastUnitPrice: 78000, createdAt: "2026-04-02T08:00:00.000Z" },
  { id: "mat_mu", sku: "AT-MU-01", name: "Mũ bảo hộ", categoryId: "cat_atld", unit: "cái", minStock: 20, location: "Kệ D1", note: "Màu vàng, có quai", lastUnitPrice: 65000, createdAt: "2026-03-08T08:00:00.000Z" },
  { id: "mat_gang", sku: "AT-GANG-VL", name: "Găng tay vải bạt", categoryId: "cat_atld", unit: "đôi", minStock: 30, location: "Kệ D1", note: "", lastUnitPrice: 12000, createdAt: "2026-03-08T08:00:00.000Z" },
  { id: "mat_giay", sku: "AT-GIAY-M", name: "Giày bảo hộ mũi thép", categoryId: "cat_atld", unit: "đôi", minStock: 10, location: "Kệ D2", note: "Size 39–43", lastUnitPrice: 320000, createdAt: "2026-04-18T08:00:00.000Z" },
  { id: "mat_daydai", sku: "AT-DAI-01", name: "Dây đai an toàn", categoryId: "cat_atld", unit: "bộ", minStock: 4, location: "Kệ D2", note: "", lastUnitPrice: 280000, createdAt: "2026-04-18T08:00:00.000Z" },
  { id: "mat_bangkeo", sku: "TH-BANG-48", name: "Băng keo điện 18m", categoryId: "cat_tieuhao", unit: "cuộn", minStock: 40, location: "Kệ E1", note: "Nitto", lastUnitPrice: 15000, createdAt: "2026-03-20T08:00:00.000Z" },
  { id: "mat_din", sku: "TH-DIN-5", name: "Đinh bê tông 5cm", categoryId: "cat_tieuhao", unit: "hộp", minStock: 12, location: "Kệ E1", note: "100 cái/hộp", lastUnitPrice: 42000, createdAt: "2026-03-20T08:00:00.000Z" },
  { id: "mat_keo", sku: "TH-KEO-SIL", name: "Keo silicone trong", categoryId: "cat_tieuhao", unit: "chai", minStock: 16, location: "Kệ E2", note: "Apollo", lastUnitPrice: 38000, createdAt: "2026-05-01T08:00:00.000Z" },
  { id: "mat_nham", sku: "TH-NHAM-80", name: "Giấy nhám P80", categoryId: "cat_tieuhao", unit: "tờ", minStock: 50, location: "Kệ E2", note: "", lastUnitPrice: 2500, createdAt: "2026-05-01T08:00:00.000Z" },
  { id: "mat_bulong", sku: "KL-BL-M10", name: "Bu lông M10x50", categoryId: "cat_kimloai", unit: "hộp", minStock: 8, location: "Kệ F1", note: "50 bộ/hộp", lastUnitPrice: 35000, createdAt: "2026-03-22T08:00:00.000Z" },
  { id: "mat_thep6", sku: "KL-THEP-6", name: "Thép tròn D6", categoryId: "cat_kimloai", unit: "kg", minStock: 80, location: "Bãi F2", note: "Hòa Phát", lastUnitPrice: 14500, createdAt: "2026-03-22T08:00:00.000Z" },
  { id: "mat_thep8", sku: "KL-THEP-8", name: "Thép tròn D8", categoryId: "cat_kimloai", unit: "kg", minStock: 80, location: "Bãi F2", note: "Hòa Phát", lastUnitPrice: 14800, createdAt: "2026-04-08T08:00:00.000Z" },
];

const receipts: Receipt[] = [
  {
    id: "rcpt_001",
    code: "PN-2026-0001",
    date: "2026-06-12",
    supplier: "Công ty TNHH Điện Việt",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "Nhập đợt 1 công trình Block A",
    status: "posted",
    createdAt: "2026-06-12T09:10:00.000Z",
    postedAt: "2026-06-12T09:18:00.000Z",
    lines: [
      { id: "ln_001a", materialId: "mat_cv25", quantity: 20, unitPrice: 850000 },
      { id: "ln_001b", materialId: "mat_cv15", quantity: 16, unitPrice: 560000 },
      { id: "ln_001c", materialId: "mat_mcb20", quantity: 40, unitPrice: 185000 },
      { id: "ln_001d", materialId: "mat_ong16", quantity: 80, unitPrice: 18000 },
    ],
  },
  {
    id: "rcpt_002",
    code: "PN-2026-0002",
    date: "2026-07-03",
    supplier: "Công ty CP Ống nhựa Tiền Phong",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "",
    status: "posted",
    createdAt: "2026-07-03T10:02:00.000Z",
    postedAt: "2026-07-03T10:20:00.000Z",
    lines: [
      { id: "ln_002a", materialId: "mat_pvc21", quantity: 120, unitPrice: 45000 },
      { id: "ln_002b", materialId: "mat_pvc27", quantity: 60, unitPrice: 62000 },
      { id: "ln_002c", materialId: "mat_van21", quantity: 50, unitPrice: 28000 },
      { id: "ln_002d", materialId: "mat_co21", quantity: 200, unitPrice: 3500 },
    ],
  },
  {
    id: "rcpt_003",
    code: "PN-2026-0003",
    date: "2026-07-21",
    supplier: "Đại lý 3M An toàn",
    warehouse: "Kho phụ — Bãi A",
    note: "Bổ sung bảo hộ cho đội mới",
    status: "posted",
    createdAt: "2026-07-21T08:40:00.000Z",
    postedAt: "2026-07-21T08:55:00.000Z",
    lines: [
      { id: "ln_003a", materialId: "mat_mu", quantity: 12, unitPrice: 65000 },
      { id: "ln_003b", materialId: "mat_gang", quantity: 40, unitPrice: 12000 },
      { id: "ln_003c", materialId: "mat_giay", quantity: 8, unitPrice: 320000 },
    ],
  },
  {
    id: "rcpt_004",
    code: "PN-2026-0004",
    date: "2026-08-09",
    supplier: "Công ty CP Thép Hòa Phát",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "",
    status: "posted",
    createdAt: "2026-08-09T13:15:00.000Z",
    postedAt: "2026-08-09T13:30:00.000Z",
    lines: [
      { id: "ln_004a", materialId: "mat_thep6", quantity: 250, unitPrice: 14500 },
      { id: "ln_004b", materialId: "mat_thep8", quantity: 180, unitPrice: 14800 },
      { id: "ln_004c", materialId: "mat_bulong", quantity: 20, unitPrice: 35000 },
    ],
  },
  {
    id: "rcpt_005",
    code: "PN-2026-0005",
    date: "2026-08-28",
    supplier: "Công ty TNHH Dụng cụ Toàn Phát",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "Mua máy khoan thay thế",
    status: "posted",
    createdAt: "2026-08-28T09:00:00.000Z",
    postedAt: "2026-08-28T09:12:00.000Z",
    lines: [
      { id: "ln_005a", materialId: "mat_khoan", quantity: 2, unitPrice: 2450000 },
      { id: "ln_005b", materialId: "mat_kim", quantity: 10, unitPrice: 95000 },
      { id: "ln_005c", materialId: "mat_thuoc", quantity: 12, unitPrice: 78000 },
    ],
  },
  {
    id: "rcpt_006",
    code: "PN-2026-0006",
    date: "2026-09-11",
    supplier: "Công ty TNHH Điện Việt",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "Bổ sung đèn LED tầng 3–5",
    status: "posted",
    createdAt: "2026-09-11T14:22:00.000Z",
    postedAt: "2026-09-11T14:40:00.000Z",
    lines: [
      { id: "ln_006a", materialId: "mat_denled", quantity: 48, unitPrice: 72000 },
      { id: "ln_006b", materialId: "mat_cv25", quantity: 8, unitPrice: 860000 },
      { id: "ln_006c", materialId: "mat_bangkeo", quantity: 60, unitPrice: 15000 },
    ],
  },
  {
    id: "rcpt_007",
    code: "PN-2026-0007",
    date: "2026-09-22",
    supplier: "Siêu thị vật tư Hải Linh",
    warehouse: "Kho phụ — Bãi A",
    note: "Nháp — chờ đối chiếu báo giá",
    status: "draft",
    createdAt: "2026-09-22T11:05:00.000Z",
    postedAt: null,
    lines: [
      { id: "ln_007a", materialId: "mat_keo", quantity: 24, unitPrice: 38000 },
      { id: "ln_007b", materialId: "mat_nham", quantity: 80, unitPrice: 2500 },
      { id: "ln_007c", materialId: "mat_din", quantity: 10, unitPrice: 42000 },
    ],
  },
  {
    id: "rcpt_008",
    code: "PN-2026-0008",
    date: "2026-09-26",
    supplier: "Đại lý 3M An toàn",
    warehouse: "Kho chính — Nhà xưởng A",
    note: "Nháp — bổ sung dây đai",
    status: "draft",
    createdAt: "2026-09-26T16:40:00.000Z",
    postedAt: null,
    lines: [
      { id: "ln_008a", materialId: "mat_daydai", quantity: 6, unitPrice: 280000 },
      { id: "ln_008b", materialId: "mat_mu", quantity: 10, unitPrice: 65000 },
    ],
  },
];

function movementsFromReceipts(list: Receipt[]): Movement[] {
  return list
    .filter((r) => r.status === "posted" && r.postedAt)
    .flatMap((r) =>
      r.lines.map((line) => ({
        id: `mv_${line.id}`,
        materialId: line.materialId,
        type: "in" as const,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        receiptId: r.id,
        note: `Nhập kho ${r.code}`,
        createdAt: r.postedAt as string,
      })),
    );
}

const adjustments: Movement[] = [
  {
    id: "mv_adj_1",
    materialId: "mat_mu",
    type: "adjust",
    quantity: -4,
    unitPrice: 65000,
    receiptId: null,
    note: "Cấp phát đội Block A — tháng 8",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "mv_adj_2",
    materialId: "mat_gang",
    type: "adjust",
    quantity: -18,
    unitPrice: 12000,
    receiptId: null,
    note: "Cấp phát định kỳ",
    createdAt: "2026-08-15T10:02:00.000Z",
  },
  {
    id: "mv_adj_3",
    materialId: "mat_pvc21",
    type: "adjust",
    quantity: -25,
    unitPrice: 45000,
    receiptId: null,
    note: "Xuất công trình — hao hụt cắt",
    createdAt: "2026-09-05T15:20:00.000Z",
  },
  {
    id: "mv_adj_4",
    materialId: "mat_thep6",
    type: "adjust",
    quantity: 12,
    unitPrice: 14500,
    receiptId: null,
    note: "Kiểm kê dư — điều chỉnh tăng",
    createdAt: "2026-09-18T09:30:00.000Z",
  },
];

export const seedData: WarehouseData = {
  categories,
  materials,
  receipts,
  movements: [...movementsFromReceipts(receipts), ...adjustments],
};

export const WAREHOUSES = [
  "Kho chính — Nhà xưởng A",
  "Kho phụ — Bãi A",
  "Kho công trình — Block B",
];

export const UNITS = ["cái", "bộ", "đôi", "cuộn", "cây", "hộp", "thùng", "chai", "tờ", "kg", "mét", "bao"];

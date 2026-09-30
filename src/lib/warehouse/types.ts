export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Warehouse = {
  id: string;
  name: string;
  address: string;
};

export type Material = {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  unit: string;
  minStock: number;
  location: string;
  note: string;
  lastUnitPrice: number;
  createdAt: string;
};

export type ReceiptStatus = "draft" | "posted" | "cancelled";

export type ReceiptLine = {
  id: string;
  materialId: string;
  quantity: number;
  unitPrice: number;
};

export type Receipt = {
  id: string;
  code: string;
  date: string;
  supplier: string;
  warehouseId: string;
  warehouse: string;
  note: string;
  status: ReceiptStatus;
  lines: ReceiptLine[];
  lineCount: number;
  totalValue: number;
  createdAt: string;
  postedAt: string | null;
};

export type MovementType = "in" | "adjust" | "reverse";

export type Movement = {
  id: string;
  materialId: string;
  warehouseId: string | null;
  type: MovementType;
  quantity: number;
  unitPrice: number;
  receiptId: string | null;
  note: string;
  createdAt: string;
};

export type StockBalance = {
  materialId: string;
  warehouseId: string | null;
  qty: number;
};

export type MonthlyInbound = {
  month: string;
  value: number;
  qty: number;
};

export type HistoryRow = Movement & {
  materialSku: string | null;
  materialName: string | null;
  materialUnit: string | null;
  receiptCode: string | null;
  receiptSupplier: string | null;
};

export type WarehouseHistoryPage = {
  rows: HistoryRow[];
  total: number;
  limit: number;
  offset: number;
};

export type WarehouseData = {
  categories: Category[];
  materials: Material[];
  receipts: Receipt[];
  movements: Movement[];
  warehouses: Warehouse[];
  stocks: StockBalance[];
  inboundByMonth: MonthlyInbound[];
};

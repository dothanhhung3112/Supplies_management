export type Category = {
  id: string;
  name: string;
  description: string;
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

export type ReceiptStatus = "draft" | "posted";

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
  warehouse: string;
  note: string;
  status: ReceiptStatus;
  lines: ReceiptLine[];
  createdAt: string;
  postedAt: string | null;
};

export type MovementType = "in" | "adjust";

export type Movement = {
  id: string;
  materialId: string;
  type: MovementType;
  quantity: number;
  unitPrice: number;
  receiptId: string | null;
  note: string;
  createdAt: string;
};

export type WarehouseData = {
  categories: Category[];
  materials: Material[];
  receipts: Receipt[];
  movements: Movement[];
};

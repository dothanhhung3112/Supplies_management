import type { Material, WarehouseData, StockBalance } from "./types";
import { format } from "date-fns";

export function stockMap(stocks: StockBalance[]) {
  const map = new Map<string, number>();
  for (const row of stocks) {
    map.set(row.materialId, (map.get(row.materialId) ?? 0) + row.qty);
  }
  return map;
}

export function stockOf(stocks: StockBalance[], materialId: string) {
  return stockMap(stocks).get(materialId) ?? 0;
}

export type StockStatus = "ok" | "low" | "out";

export function stockStatus(qty: number, minStock: number): StockStatus {
  if (qty <= 0) return "out";
  if (qty <= minStock) return "low";
  return "ok";
}

export function stockStatusLabel(status: StockStatus) {
  if (status === "out") return "Hết hàng";
  if (status === "low") return "Sắp hết";
  return "Đủ hàng";
}

export function receiptTotal(lines: { quantity: number; unitPrice: number }[]) {
  return lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}

export function inventoryValue(materials: Material[], stocks: StockBalance[]) {
  const stock = stockMap(stocks);
  return materials.reduce((sum, m) => sum + (stock.get(m.id) ?? 0) * m.lastUnitPrice, 0);
}

export function lowStockMaterials(data: WarehouseData) {
  const stocks = stockMap(data.stocks);
  return data.materials
    .map((m) => {
      const qty = stocks.get(m.id) ?? 0;
      return { material: m, qty, status: stockStatus(qty, m.minStock) };
    })
    .filter((row) => row.status !== "ok")
    .sort((a, b) => a.qty - b.qty);
}

export function inboundByMonth(data: WarehouseData, months = 6) {
  const keys: string[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(format(d, "yyyy-MM"));
  }
  const source = new Map(data.inboundByMonth.map((row) => [row.month, row]));
  return keys.map((month) => source.get(month) ?? { month, value: 0, qty: 0 });
}

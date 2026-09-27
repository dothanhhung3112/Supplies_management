import type { Material, Movement, WarehouseData } from "./types";

export function stockOf(movements: Movement[], materialId: string) {
  let qty = 0;
  for (const m of movements) {
    if (m.materialId === materialId) qty += m.quantity;
  }
  return qty;
}

export function stockMap(movements: Movement[]) {
  const map = new Map<string, number>();
  for (const m of movements) {
    map.set(m.materialId, (map.get(m.materialId) ?? 0) + m.quantity);
  }
  return map;
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

export function inventoryValue(materials: Material[], movements: Movement[]) {
  const stocks = stockMap(movements);
  return materials.reduce((sum, m) => sum + (stocks.get(m.id) ?? 0) * m.lastUnitPrice, 0);
}

export function lowStockMaterials(data: WarehouseData) {
  const stocks = stockMap(data.movements);
  return data.materials
    .map((m) => {
      const qty = stocks.get(m.id) ?? 0;
      return { material: m, qty, status: stockStatus(qty, m.minStock) };
    })
    .filter((row) => row.status !== "ok")
    .sort((a, b) => a.qty - b.qty);
}

export function inboundByMonth(data: WarehouseData, months = 6) {
  const now = new Date();
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    keys.push(key);
  }
  const buckets = new Map(keys.map((k) => [k, { month: k, value: 0, qty: 0 }]));
  for (const r of data.receipts) {
    if (r.status !== "posted") continue;
    const key = r.date.slice(0, 7);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    for (const line of r.lines) {
      bucket.value += line.quantity * line.unitPrice;
      bucket.qty += line.quantity;
    }
  }
  return keys.map((k) => buckets.get(k)!);
}

export function uniqueSuppliers(data: WarehouseData) {
  return [...new Set(data.receipts.map((r) => r.supplier).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "vi"),
  );
}

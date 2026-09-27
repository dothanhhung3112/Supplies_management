//#region node_modules/.nitro/vite/services/ssr/assets/selectors-BQiVadiX.js
function stockMap(movements) {
	const map = /* @__PURE__ */ new Map();
	for (const m of movements) map.set(m.materialId, (map.get(m.materialId) ?? 0) + m.quantity);
	return map;
}
function stockStatus(qty, minStock) {
	if (qty <= 0) return "out";
	if (qty <= minStock) return "low";
	return "ok";
}
function stockStatusLabel(status) {
	if (status === "out") return "Hết hàng";
	if (status === "low") return "Sắp hết";
	return "Đủ hàng";
}
function receiptTotal(lines) {
	return lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}
function inventoryValue(materials, movements) {
	const stocks = stockMap(movements);
	return materials.reduce((sum, m) => sum + (stocks.get(m.id) ?? 0) * m.lastUnitPrice, 0);
}
function lowStockMaterials(data) {
	const stocks = stockMap(data.movements);
	return data.materials.map((m) => {
		const qty = stocks.get(m.id) ?? 0;
		return {
			material: m,
			qty,
			status: stockStatus(qty, m.minStock)
		};
	}).filter((row) => row.status !== "ok").sort((a, b) => a.qty - b.qty);
}
function inboundByMonth(data, months = 6) {
	const now = /* @__PURE__ */ new Date();
	const keys = [];
	for (let i = months - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		keys.push(key);
	}
	const buckets = new Map(keys.map((k) => [k, {
		month: k,
		value: 0,
		qty: 0
	}]));
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
	return keys.map((k) => buckets.get(k));
}
function uniqueSuppliers(data) {
	return [...new Set(data.receipts.map((r) => r.supplier).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
}
//#endregion
export { stockMap as a, uniqueSuppliers as c, receiptTotal as i, inventoryValue as n, stockStatus as o, lowStockMaterials as r, stockStatusLabel as s, inboundByMonth as t };

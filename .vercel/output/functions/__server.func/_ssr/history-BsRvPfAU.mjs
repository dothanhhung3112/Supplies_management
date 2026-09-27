import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as Search } from "../_libs/lucide-react.mjs";
import { S as useWarehouseStore, g as formatDateTime, r as Input, v as formatQty, y as formatVnd } from "./router-D_68d68J.mjs";
import { t as EmptyState } from "./empty-state-CbDaSP9J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { t as Badge } from "./badge-B0oE1gOu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-BsRvPfAU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const materials = useWarehouseStore((s) => s.materials);
	const receipts = useWarehouseStore((s) => s.receipts);
	const movements = useWarehouseStore((s) => s.movements);
	const [q, setQ] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const materialById = (0, import_react.useMemo)(() => new Map(materials.map((m) => [m.id, m])), [materials]);
	const receiptById = (0, import_react.useMemo)(() => new Map(receipts.map((r) => [r.id, r])), [receipts]);
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return [...movements].filter((m) => type === "all" ? true : m.type === type).filter((m) => {
			if (!needle) return true;
			const mat = materialById.get(m.materialId);
			const rcpt = m.receiptId ? receiptById.get(m.receiptId) : null;
			return `${mat?.sku ?? ""} ${mat?.name ?? ""} ${m.note} ${rcpt?.code ?? ""} ${rcpt?.supplier ?? ""}`.toLowerCase().includes(needle);
		}).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}, [
		movements,
		type,
		q,
		materialById,
		receiptById
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Nhật ký",
				title: "Lịch sử kho",
				description: "Mọi lần nhập kho và điều chỉnh tồn, mới nhất ở trên."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Tìm vật tư, số phiếu, lý do…",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-lg bg-secondary p-1",
					children: [
						["all", "Tất cả"],
						["in", "Nhập kho"],
						["adjust", "Điều chỉnh"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setType(key),
						className: type === key ? "h-9 rounded-md bg-card px-3 text-sm font-medium shadow-card" : "h-9 rounded-md px-3 text-sm text-muted-foreground",
						children: label
					}, key))
				})]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" }),
				title: "Chưa có phát sinh",
				description: "Ghi sổ phiếu nhập hoặc điều chỉnh tồn để thấy lịch sử."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: rows.map((m) => {
					const mat = materialById.get(m.materialId);
					const rcpt = m.receiptId ? receiptById.get(m.receiptId) : null;
					const inbound = m.type === "in";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-card p-4 shadow-card sm:px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: inbound ? "success" : "secondary",
											children: inbound ? "Nhập kho" : "Điều chỉnh"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: formatDateTime(m.createdAt)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-medium",
										children: mat?.name ?? "Vật tư đã xóa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-muted-foreground",
										children: mat?.sku
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: m.note
									}),
									rcpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/receipts/$id",
										params: { id: rcpt.id },
										className: "mt-1 inline-block text-sm font-medium text-primary hover:underline",
										children: [
											rcpt.code,
											" · ",
											rcpt.supplier
										]
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 text-left sm:text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `font-mono text-lg font-semibold tabular-nums ${m.quantity < 0 ? "text-destructive" : "text-success"}`,
									children: [m.quantity > 0 ? "+" : "", formatQty(m.quantity, mat?.unit)]
								}), inbound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-muted-foreground tabular-nums",
									children: formatVnd(m.quantity * m.unitPrice)
								}) : null]
							})]
						})
					}, m.id);
				})
			})
		]
	});
}
//#endregion
export { HistoryPage as component };

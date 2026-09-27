import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as Search, u as PackagePlus } from "../_libs/lucide-react.mjs";
import { S as useWarehouseStore, h as formatDate, r as Input, u as Button, y as formatVnd } from "./router-D_68d68J.mjs";
import { t as EmptyState } from "./empty-state-CbDaSP9J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { t as Badge } from "./badge-B0oE1gOu.mjs";
import { i as receiptTotal } from "./selectors-BQiVadiX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts.index-Drn9cmGx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptsPage() {
	const receipts = useWarehouseStore((s) => s.receipts);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return [...receipts].filter((r) => status === "all" ? true : r.status === status).filter((r) => {
			if (!needle) return true;
			return `${r.code} ${r.supplier} ${r.warehouse} ${r.note}`.toLowerCase().includes(needle);
		}).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
	}, [
		receipts,
		q,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Nhập kho",
				title: "Phiếu nhập kho",
				description: "Tạo phiếu, lưu nháp rồi ghi sổ để cộng tồn. Phiếu đã ghi sổ không sửa được.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/receipts/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "size-4" }), "Tạo phiếu nhập"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Tìm số phiếu, nhà cung cấp…",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-lg bg-secondary p-1",
					children: [
						["all", "Tất cả"],
						["draft", "Nháp"],
						["posted", "Đã ghi sổ"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus(key),
						className: status === key ? "h-9 rounded-md bg-card px-3 text-sm font-medium shadow-card" : "h-9 rounded-md px-3 text-sm text-muted-foreground",
						children: label
					}, key))
				})]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "size-5" }),
				title: "Chưa có phiếu",
				description: "Tạo phiếu nhập để ghi nhận hàng vào kho.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/receipts/new",
						children: "Tạo phiếu nhập"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 md:hidden",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/receipts/$id",
					params: { id: r.id },
					className: "block rounded-xl bg-card p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono font-medium",
								children: r.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "posted" ? "success" : "secondary",
								children: r.status === "posted" ? "Đã ghi sổ" : "Nháp"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: r.supplier
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								formatDate(r.date),
								" · ",
								r.warehouse
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-sm tabular-nums",
							children: formatVnd(receiptTotal(r.lines))
						})
					]
				}, r.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto rounded-xl bg-card shadow-card md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[52rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Số phiếu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Ngày"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Nhà cung cấp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Kho"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Trạng thái"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-right font-medium",
								children: "Giá trị"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0 hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/receipts/$id",
									params: { id: r.id },
									className: "font-mono font-medium hover:underline",
									children: r.code
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: formatDate(r.date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: r.supplier
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted-foreground",
								children: r.warehouse
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "posted" ? "success" : "secondary",
									children: r.status === "posted" ? "Đã ghi sổ" : "Nháp"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right font-mono tabular-nums",
								children: formatVnd(receiptTotal(r.lines))
							})
						]
					}, r.id)) })]
				})
			})] })
		]
	});
}
//#endregion
export { ReceiptsPage as component };

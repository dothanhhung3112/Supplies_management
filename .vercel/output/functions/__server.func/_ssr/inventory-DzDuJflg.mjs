import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as SlidersHorizontal, o as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useWarehouseStore, _ as formatNumber, a as DialogContent, c as DialogHeader, i as Dialog, l as DialogTitle, o as DialogDescription, r as Input, s as DialogFooter, u as Button, v as formatQty, y as formatVnd } from "./router-D_68d68J.mjs";
import { n as Textarea, t as Label } from "./textarea-CtuV-O3Z.mjs";
import { t as EmptyState } from "./empty-state-CbDaSP9J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { a as stockMap, o as stockStatus } from "./selectors-BQiVadiX.mjs";
import { t as StockBadge } from "./stock-badge-DmUg3_5F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DzDuJflg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdjustDialog({ open, onOpenChange, material, currentQty }) {
	const adjustStock = useWarehouseStore((s) => s.adjustStock);
	const [qty, setQty] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [dir, setDir] = (0, import_react.useState)("out");
	(0, import_react.useEffect)(() => {
		if (open) {
			setQty("");
			setNote("");
			setDir("out");
		}
	}, [open, material]);
	function submit(e) {
		e.preventDefault();
		if (!material) return;
		const n = Number(qty);
		if (!n || n <= 0) {
			toast.error("Nhập số lượng lớn hơn 0.");
			return;
		}
		const signed = dir === "out" ? -n : n;
		const err = adjustStock(material.id, signed, note);
		if (err) {
			toast.error(err);
			return;
		}
		toast.success("Đã ghi điều chỉnh tồn kho.");
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Điều chỉnh tồn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: material ? `${material.name} · đang có ${formatQty(currentQty, material.unit)}` : "Chọn vật tư" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: dir === "in" ? "default" : "outline",
						onClick: () => setDir("in"),
						children: "Tăng tồn"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: dir === "out" ? "default" : "outline",
						onClick: () => setDir("out"),
						children: "Giảm tồn"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: "aqty",
						children: ["Số lượng ", material ? `(${material.unit})` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "aqty",
						type: "number",
						min: 0,
						step: "any",
						value: qty,
						onChange: (e) => setQty(e.target.value),
						className: "tabular-nums",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "anote",
						children: "Lý do"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "anote",
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "Kiểm kê, cấp phát, hao hụt…",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Hủy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Ghi điều chỉnh"
				})] })
			]
		})] })
	});
}
function InventoryPage() {
	const categories = useWarehouseStore((s) => s.categories);
	const materials = useWarehouseStore((s) => s.materials);
	const movements = useWarehouseStore((s) => s.movements);
	const stocks = (0, import_react.useMemo)(() => stockMap(movements), [movements]);
	const [q, setQ] = (0, import_react.useState)("");
	const [catFilter, setCatFilter] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [adjusting, setAdjusting] = (0, import_react.useState)(null);
	const catName = (id) => categories.find((c) => c.id === id)?.name ?? "—";
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return materials.map((m) => {
			const qty = stocks.get(m.id) ?? 0;
			return {
				material: m,
				qty,
				status: stockStatus(qty, m.minStock),
				value: qty * m.lastUnitPrice
			};
		}).filter((row) => {
			if (catFilter !== "all" && row.material.categoryId !== catFilter) return false;
			if (status !== "all" && row.status !== status) return false;
			if (!needle) return true;
			return `${row.material.sku} ${row.material.name} ${row.material.location}`.toLowerCase().includes(needle);
		}).sort((a, b) => a.qty - b.qty);
	}, [
		materials,
		stocks,
		q,
		catFilter,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Kho",
				title: "Tồn kho",
				description: "Số lượng hiện có theo từng mã, cảnh báo dưới định mức và điều chỉnh kiểm kê."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 lg:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Tìm mã, tên, vị trí…",
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: catFilter,
						onChange: (e) => setCatFilter(e.target.value),
						className: "h-11 rounded-md border border-input bg-card px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Tất cả nhóm"
						}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 rounded-lg bg-secondary p-1",
						children: [
							["all", "Tất cả"],
							["out", "Hết"],
							["low", "Sắp hết"],
							["ok", "Đủ"]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStatus(key),
							className: status === key ? "h-9 rounded-md bg-card px-3 text-sm font-medium shadow-card" : "h-9 rounded-md px-3 text-sm text-muted-foreground",
							children: label
						}, key))
					})
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" }),
				title: "Không có mã khớp",
				description: "Đổi bộ lọc hoặc từ khóa tìm kiếm."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 md:hidden",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: row.material.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: row.material.sku
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, {
								qty: row.qty,
								minStock: row.material.minStock
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xl font-semibold tabular-nums",
							children: formatQty(row.qty, row.material.unit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Min ",
								formatNumber(row.material.minStock),
								" · ",
								formatVnd(row.value)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "mt-3",
							onClick: () => setAdjusting(row.material),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "Điều chỉnh"]
						})
					]
				}, row.material.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto rounded-xl bg-card shadow-card md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[56rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Tên"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Nhóm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Tồn"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Min"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Trạng thái"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Giá trị"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Vị trí"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-3 font-medium" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0 hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-mono text-xs",
								children: row.material.sku
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-medium",
								children: row.material.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted-foreground",
								children: catName(row.material.categoryId)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-mono tabular-nums",
								children: formatQty(row.qty, row.material.unit)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: formatNumber(row.material.minStock)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, {
									qty: row.qty,
									minStock: row.material.minStock
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-mono tabular-nums",
								children: formatVnd(row.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: row.material.location || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setAdjusting(row.material),
									children: "Điều chỉnh"
								})
							})
						]
					}, row.material.id)) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdjustDialog, {
				open: !!adjusting,
				onOpenChange: (v) => !v && setAdjusting(null),
				material: adjusting,
				currentQty: adjusting ? stocks.get(adjusting.id) ?? 0 : 0
			})
		]
	});
}
//#endregion
export { InventoryPage as component };

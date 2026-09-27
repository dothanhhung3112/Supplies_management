import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as ArrowRight, h as ClipboardList, n as Warehouse, r as TriangleAlert, u as PackagePlus, y as Boxes } from "../_libs/lucide-react.mjs";
import { S as useWarehouseStore, _ as formatNumber, m as cn, u as Button, y as formatVnd } from "./router-D_68d68J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { t as Badge } from "./badge-B0oE1gOu.mjs";
import { i as receiptTotal, n as inventoryValue, r as lowStockMaterials, t as inboundByMonth } from "./selectors-BQiVadiX.mjs";
import { t as StockBadge } from "./stock-badge-DmUg3_5F.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5fjlggt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl bg-card text-card-foreground shadow-card", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col gap-1 p-5", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-base font-semibold leading-snug", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-5 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
function monthLabel(key) {
	const [y, m] = key.split("-");
	return `${[
		"Th1",
		"Th2",
		"Th3",
		"Th4",
		"Th5",
		"Th6",
		"Th7",
		"Th8",
		"Th9",
		"Th10",
		"Th11",
		"Th12"
	][Number(m) - 1] ?? m} ${y?.slice(2) ?? ""}`;
}
function Home() {
	const categories = useWarehouseStore((s) => s.categories);
	const materials = useWarehouseStore((s) => s.materials);
	const receipts = useWarehouseStore((s) => s.receipts);
	const movements = useWarehouseStore((s) => s.movements);
	const data = {
		categories,
		materials,
		receipts,
		movements
	};
	const low = lowStockMaterials(data);
	const value = inventoryValue(materials, movements);
	const thisMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
	const postedThisMonth = receipts.filter((r) => r.status === "posted" && r.date.startsWith(thisMonth));
	const drafts = receipts.filter((r) => r.status === "draft");
	const chart = inboundByMonth(data, 6).map((row) => ({
		...row,
		label: monthLabel(row.month)
	}));
	const recent = [...receipts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Kho vật tư",
				title: "Tổng quan nhập kho",
				description: "Theo dõi danh mục, tồn kho và phiếu nhập trên một màn hình.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/receipts/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "size-4" }), "Tạo phiếu nhập"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-4" }),
						label: "Mã vật tư",
						value: formatNumber(materials.length),
						hint: `${categories.length} nhóm hàng`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-4" }),
						label: "Giá trị tồn",
						value: formatVnd(value),
						hint: "Theo đơn giá nhập gần nhất"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
						label: "Cảnh báo tồn",
						value: formatNumber(low.length),
						hint: "Hết hàng hoặc dưới mức tối thiểu",
						tone: low.length ? "warn" : "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" }),
						label: "Phiếu tháng này",
						value: formatNumber(postedThisMonth.length),
						hint: drafts.length ? `${drafts.length} phiếu nháp` : "Không có nháp"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Nhập kho 6 tháng" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chart,
								barCategoryGap: "28%",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: {
											fill: "var(--color-muted-foreground)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickFormatter: (v) => `${Math.round(Number(v) / 1e6)}tr`,
										tick: {
											fill: "var(--color-muted-foreground)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false,
										width: 40
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-secondary)" },
										content: ({ active, payload }) => {
											if (!active || !payload?.[0]) return null;
											const row = payload[0].payload;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-md border border-border bg-card px-3 py-2 text-sm shadow-card",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium",
														children: row.label
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "tabular-nums",
														children: formatVnd(row.value)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-muted-foreground",
														children: [formatNumber(row.qty), " đơn vị nhập"]
													})
												]
											});
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										fill: "var(--color-primary)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tồn thấp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/inventory",
								children: ["Xem kho", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: low.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "Không có mã nào dưới định mức."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: low.slice(0, 6).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: row.material.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: row.material.sku
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-sm tabular-nums",
									children: [
										formatNumber(row.qty),
										"/",
										formatNumber(row.material.minStock)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, {
									qty: row.qty,
									minStock: row.material.minStock
								})]
							})]
						}, row.material.id))
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-center justify-between space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Phiếu gần đây" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/receipts",
						children: ["Tất cả phiếu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/receipts/$id",
						params: { id: r.id },
						className: "flex items-center justify-between gap-3 px-5 py-3 hover:bg-secondary/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm font-medium",
								children: r.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: r.supplier
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-col items-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums",
								children: formatVnd(receiptTotal(r.lines))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "posted" ? "success" : "secondary",
								children: r.status === "posted" ? "Đã ghi sổ" : "Nháp"
							})]
						})]
					}) }, r.id))
				})
			})] })
		]
	});
}
function Stat({ icon, label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex flex-col gap-3 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: tone === "warn" ? "text-warning" : tone === "ok" ? "text-success" : "text-muted-foreground",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl font-semibold tabular-nums tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	}) });
}
//#endregion
export { Home as component };

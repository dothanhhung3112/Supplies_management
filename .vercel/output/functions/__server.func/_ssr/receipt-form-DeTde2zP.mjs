import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as ChevronsUpDown, i as Trash2, s as Plus, v as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useWarehouseStore, _ as formatNumber, b as todayIsoDate, m as cn, p as WAREHOUSES, r as Input, u as Button, x as uid, y as formatVnd } from "./router-D_68d68J.mjs";
import { n as Textarea, t as Label } from "./textarea-CtuV-O3Z.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cr9zMZLj.mjs";
import { c as uniqueSuppliers, i as receiptTotal } from "./selectors-BQiVadiX.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt-form-DeTde2zP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-card outline-none", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function MaterialPicker({ materials, categories, value, onChange, disabled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const selected = materials.find((m) => m.id === value);
	const catName = (id) => categories.find((c) => c.id === id)?.name ?? "";
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return materials;
		return materials.filter((m) => {
			return `${m.sku} ${m.name} ${catName(m.categoryId)}`.toLowerCase().includes(needle);
		});
	}, [
		materials,
		q,
		categories
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				disabled,
				className: "h-11 w-full justify-between font-normal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("truncate", !selected && "text-muted-foreground"),
					children: selected ? `${selected.sku} — ${selected.name}` : "Chọn vật tư"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "size-4 shrink-0 text-muted-foreground" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			className: "w-[min(28rem,calc(100vw-2rem))] p-2",
			align: "start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Tìm mã, tên vật tư…",
				className: "mb-2 h-10",
				autoFocus: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-64 overflow-y-auto",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 py-6 text-center text-sm text-muted-foreground",
					children: "Không có vật tư khớp."
				}) : filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(m.id);
						setOpen(false);
						setQ("");
					},
					className: "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mt-0.5 size-4 shrink-0", m.id === value ? "opacity-100" : "opacity-0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-mono text-xs text-muted-foreground",
							children: [
								m.sku,
								" · ",
								catName(m.categoryId),
								" · ",
								m.unit
							]
						})]
					})]
				}, m.id))
			})]
		})]
	});
}
function emptyLine() {
	return {
		id: uid("ln"),
		materialId: "",
		quantity: 1,
		unitPrice: 0
	};
}
function ReceiptForm({ receipt }) {
	const navigate = useNavigate();
	const categories = useWarehouseStore((s) => s.categories);
	const materials = useWarehouseStore((s) => s.materials);
	const receipts = useWarehouseStore((s) => s.receipts);
	const saveReceipt = useWarehouseStore((s) => s.saveReceipt);
	const postReceipt = useWarehouseStore((s) => s.postReceipt);
	const posted = receipt?.status === "posted";
	const [date, setDate] = (0, import_react.useState)(receipt?.date ?? todayIsoDate());
	const [supplier, setSupplier] = (0, import_react.useState)(receipt?.supplier ?? "");
	const [warehouse, setWarehouse] = (0, import_react.useState)(receipt?.warehouse ?? WAREHOUSES[0]);
	const [note, setNote] = (0, import_react.useState)(receipt?.note ?? "");
	const [lines, setLines] = (0, import_react.useState)(receipt?.lines.length ? receipt.lines : [emptyLine()]);
	const suppliers = (0, import_react.useMemo)(() => uniqueSuppliers({
		categories,
		materials,
		receipts,
		movements: []
	}), [
		categories,
		materials,
		receipts
	]);
	const total = receiptTotal(lines);
	const materialById = (0, import_react.useMemo)(() => new Map(materials.map((m) => [m.id, m])), [materials]);
	function patchLine(id, patch) {
		setLines((prev) => prev.map((l) => l.id === id ? {
			...l,
			...patch
		} : l));
	}
	function chooseMaterial(lineId, materialId) {
		patchLine(lineId, {
			materialId,
			unitPrice: materials.find((m) => m.id === materialId)?.lastUnitPrice ?? 0
		});
	}
	function payload() {
		return {
			date,
			supplier: supplier.trim(),
			warehouse,
			note: note.trim(),
			lines: lines.filter((l) => l.materialId)
		};
	}
	function validate() {
		if (!supplier.trim()) {
			toast.error("Nhập nhà cung cấp.");
			return false;
		}
		const complete = lines.filter((l) => l.materialId);
		if (complete.length === 0) {
			toast.error("Thêm ít nhất một dòng vật tư.");
			return false;
		}
		if (complete.some((l) => l.quantity <= 0)) {
			toast.error("Số lượng phải lớn hơn 0.");
			return false;
		}
		return true;
	}
	function onSaveDraft() {
		if (!validate()) return;
		const id = saveReceipt(payload(), receipt?.id);
		toast.success("Đã lưu nháp.");
		if (!receipt) navigate({
			to: "/receipts/$id",
			params: { id }
		});
	}
	function onPost() {
		if (!validate()) return;
		const id = saveReceipt(payload(), receipt?.id);
		const err = postReceipt(id);
		if (err) {
			toast.error(err);
			return;
		}
		toast.success("Đã ghi sổ phiếu nhập. Tồn kho đã được cập nhật.");
		navigate({
			to: "/receipts/$id",
			params: { id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl bg-card p-4 shadow-card sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "date",
								children: "Ngày nhập"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "date",
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								disabled: posted
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "warehouse",
								children: "Kho nhận"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: warehouse,
								onValueChange: setWarehouse,
								disabled: posted,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "warehouse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: WAREHOUSES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: w,
									children: w
								}, w)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 sm:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "supplier",
									children: "Nhà cung cấp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "supplier",
									list: "supplier-list",
									value: supplier,
									onChange: (e) => setSupplier(e.target.value),
									placeholder: "Tên nhà cung cấp",
									disabled: posted
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "supplier-list",
									children: suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: s }, s))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "note",
								children: "Ghi chú"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "note",
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Số hóa đơn, công trình, ghi chú nội bộ…",
								disabled: posted
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-4 shadow-card sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Dòng vật tư"
						}), posted ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setLines((p) => [...p, emptyLine()]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Thêm dòng"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden overflow-x-auto md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[44rem] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-3 font-medium",
										children: "Vật tư"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-24 pb-2 pr-3 font-medium",
										children: "SL"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-20 pb-2 pr-3 font-medium",
										children: "ĐVT"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-36 pb-2 pr-3 font-medium",
										children: "Đơn giá"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-36 pb-2 pr-3 text-right font-medium",
										children: "Thành tiền"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-12 pb-2 font-medium" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((line) => {
								const mat = materialById.get(line.materialId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border last:border-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialPicker, {
												materials,
												categories,
												value: line.materialId,
												onChange: (id) => chooseMaterial(line.id, id),
												disabled: posted
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 0,
												step: "any",
												value: line.quantity,
												onChange: (e) => patchLine(line.id, { quantity: Number(e.target.value) }),
												disabled: posted,
												className: "h-11 tabular-nums"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 text-muted-foreground",
											children: mat?.unit ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 0,
												step: "1000",
												value: line.unitPrice,
												onChange: (e) => patchLine(line.id, { unitPrice: Number(e.target.value) }),
												disabled: posted,
												className: "h-11 tabular-nums"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 text-right font-mono tabular-nums",
											children: formatVnd(line.quantity * line.unitPrice)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2",
											children: posted ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Xóa dòng",
												onClick: () => setLines((p) => p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										})
									]
								}, line.id);
							}) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3 md:hidden",
						children: lines.map((line, i) => {
							const mat = materialById.get(line.materialId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-muted-foreground",
										children: ["Dòng ", i + 1]
									}), posted ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon-sm",
										"aria-label": "Xóa dòng",
										onClick: () => setLines((p) => p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialPicker, {
											materials,
											categories,
											value: line.materialId,
											onChange: (id) => chooseMaterial(line.id, id),
											disabled: posted
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Số lượng ", mat ? `(${mat.unit})` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													step: "any",
													value: line.quantity,
													onChange: (e) => patchLine(line.id, { quantity: Number(e.target.value) }),
													disabled: posted,
													className: "tabular-nums"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Đơn giá" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													step: "1000",
													value: line.unitPrice,
													onChange: (e) => patchLine(line.id, { unitPrice: Number(e.target.value) }),
													disabled: posted,
													className: "tabular-nums"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-right text-sm",
											children: [
												"Thành tiền",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono tabular-nums font-medium",
													children: formatVnd(line.quantity * line.unitPrice)
												})
											]
										})
									]
								})]
							}, line.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [lines.filter((l) => l.materialId).length, " dòng"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold tabular-nums",
							children: formatVnd(total)
						})]
					})
				]
			}),
			posted ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: onSaveDraft,
					children: "Lưu nháp"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: onPost,
					children: "Ghi sổ nhập kho"
				})]
			})
		]
	});
}
function ReceiptReadOnlyMeta({ receipt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted-foreground",
		children: [
			"Tổng ",
			formatNumber(receipt.lines.length),
			" dòng · ",
			formatVnd(receiptTotal(receipt.lines))
		]
	});
}
//#endregion
export { ReceiptReadOnlyMeta as n, ReceiptForm as t };

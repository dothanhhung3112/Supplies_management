import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Pencil, i as Trash2, m as Ellipsis, o as Search, s as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useWarehouseStore, _ as formatNumber, a as DialogContent, c as DialogHeader, f as UNITS, i as Dialog, l as DialogTitle, m as cn, o as DialogDescription, r as Input, s as DialogFooter, u as Button, y as formatVnd } from "./router-D_68d68J.mjs";
import { n as Textarea, t as Label } from "./textarea-CtuV-O3Z.mjs";
import { a as Trigger, i as Root2, n as Item2, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cr9zMZLj.mjs";
import { t as EmptyState } from "./empty-state-CbDaSP9J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-C967yPdJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BBFe4iWY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryDialog({ open, onOpenChange, category }) {
	const addCategory = useWarehouseStore((s) => s.addCategory);
	const updateCategory = useWarehouseStore((s) => s.updateCategory);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setName(category?.name ?? "");
			setDescription(category?.description ?? "");
		}
	}, [open, category]);
	function submit(e) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Nhập tên nhóm hàng.");
			return;
		}
		const payload = {
			name: name.trim(),
			description: description.trim()
		};
		if (category) {
			updateCategory(category.id, payload);
			toast.success("Đã cập nhật nhóm hàng.");
		} else {
			addCategory(payload);
			toast.success("Đã thêm nhóm hàng.");
		}
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: category ? "Sửa nhóm hàng" : "Thêm nhóm hàng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Nhóm dùng để lọc danh mục và tồn kho." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cname",
						children: "Tên nhóm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cname",
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cdesc",
						children: "Mô tả"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "cdesc",
						value: description,
						onChange: (e) => setDescription(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Hủy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: category ? "Lưu" : "Thêm"
				})] })
			]
		})] })
	});
}
function fromMaterial(m, fallbackCategory) {
	return {
		sku: m?.sku ?? "",
		name: m?.name ?? "",
		categoryId: m?.categoryId ?? fallbackCategory ?? "",
		unit: m?.unit ?? "cái",
		minStock: m ? String(m.minStock) : "0",
		location: m?.location ?? "",
		note: m?.note ?? "",
		lastUnitPrice: m ? String(m.lastUnitPrice) : "0"
	};
}
function MaterialDialog({ open, onOpenChange, material }) {
	const categories = useWarehouseStore((s) => s.categories);
	const addMaterial = useWarehouseStore((s) => s.addMaterial);
	const updateMaterial = useWarehouseStore((s) => s.updateMaterial);
	const [form, setForm] = (0, import_react.useState)(fromMaterial());
	(0, import_react.useEffect)(() => {
		if (open) setForm(fromMaterial(material ?? void 0, categories[0]?.id));
	}, [
		open,
		material,
		categories
	]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function submit(e) {
		e.preventDefault();
		if (!form.sku.trim() || !form.name.trim() || !form.categoryId) {
			toast.error("Nhập mã, tên và nhóm hàng.");
			return;
		}
		const payload = {
			sku: form.sku.trim().toUpperCase(),
			name: form.name.trim(),
			categoryId: form.categoryId,
			unit: form.unit,
			minStock: Number(form.minStock) || 0,
			location: form.location.trim(),
			note: form.note.trim(),
			lastUnitPrice: Number(form.lastUnitPrice) || 0
		};
		if (material) {
			updateMaterial(material.id, payload);
			toast.success("Đã cập nhật vật tư.");
		} else {
			addMaterial(payload);
			toast.success("Đã thêm vật tư.");
		}
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: material ? "Sửa vật tư" : "Thêm vật tư" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Mã SKU dùng để tìm nhanh trên phiếu nhập và tồn kho." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sku",
								children: "Mã SKU"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sku",
								value: form.sku,
								onChange: (e) => set("sku", e.target.value),
								className: "font-mono",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nhóm hàng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.categoryId,
								onValueChange: (v) => set("categoryId", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Chọn nhóm" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id)) })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Tên vật tư"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							value: form.name,
							onChange: (e) => set("name", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Đơn vị" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.unit,
									onValueChange: (v) => set("unit", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: u,
										children: u
									}, u)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "min",
									children: "Tồn tối thiểu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "min",
									type: "number",
									min: 0,
									value: form.minStock,
									onChange: (e) => set("minStock", e.target.value),
									className: "tabular-nums"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "price",
									children: "Đơn giá gần nhất"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "price",
									type: "number",
									min: 0,
									step: "1000",
									value: form.lastUnitPrice,
									onChange: (e) => set("lastUnitPrice", e.target.value),
									className: "tabular-nums"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "loc",
							children: "Vị trí kho"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "loc",
							value: form.location,
							onChange: (e) => set("location", e.target.value),
							placeholder: "Kệ A1, Bãi F2…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "Ghi chú"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							value: form.note,
							onChange: (e) => set("note", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Hủy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: material ? "Lưu" : "Thêm"
					})] })
				]
			})]
		})
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-card", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
function CatalogPage() {
	const [tab, setTab] = (0, import_react.useState)("materials");
	const categories = useWarehouseStore((s) => s.categories);
	const materials = useWarehouseStore((s) => s.materials);
	const [q, setQ] = (0, import_react.useState)("");
	const [catFilter, setCatFilter] = (0, import_react.useState)("all");
	const [matOpen, setMatOpen] = (0, import_react.useState)(false);
	const [catOpen, setCatOpen] = (0, import_react.useState)(false);
	const [editingMat, setEditingMat] = (0, import_react.useState)(null);
	const [editingCat, setEditingCat] = (0, import_react.useState)(null);
	const [deletingMat, setDeletingMat] = (0, import_react.useState)(null);
	const [deletingCat, setDeletingCat] = (0, import_react.useState)(null);
	const deleteMaterial = useWarehouseStore((s) => s.deleteMaterial);
	const deleteCategory = useWarehouseStore((s) => s.deleteCategory);
	const catName = (id) => categories.find((c) => c.id === id)?.name ?? "—";
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return materials.filter((m) => {
			if (catFilter !== "all" && m.categoryId !== catFilter) return false;
			if (!needle) return true;
			return `${m.sku} ${m.name} ${m.location} ${catName(m.categoryId)}`.toLowerCase().includes(needle);
		});
	}, [
		materials,
		q,
		catFilter,
		categories
	]);
	function confirmDeleteMat() {
		if (!deletingMat) return;
		const err = deleteMaterial(deletingMat.id);
		if (err) toast.error(err);
		else toast.success("Đã xóa vật tư.");
		setDeletingMat(null);
	}
	function confirmDeleteCat() {
		if (!deletingCat) return;
		const err = deleteCategory(deletingCat.id);
		if (err) toast.error(err);
		else toast.success("Đã xóa nhóm hàng.");
		setDeletingCat(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Danh mục",
				title: "Vật tư & nhóm hàng",
				description: "Quản lý mã SKU, đơn vị tính, định mức tồn và vị trí kệ.",
				actions: tab === "materials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditingMat(null);
						setMatOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Thêm vật tư"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditingCat(null);
						setCatOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Thêm nhóm"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 rounded-lg bg-secondary p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabButton, {
					active: tab === "materials",
					onClick: () => setTab("materials"),
					children: [
						"Vật tư (",
						materials.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabButton, {
					active: tab === "categories",
					onClick: () => setTab("categories"),
					children: [
						"Nhóm hàng (",
						categories.length,
						")"
					]
				})]
			}),
			tab === "materials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Tìm mã, tên, vị trí…",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
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
				})]
			}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" }),
				title: "Không có vật tư",
				description: "Thử đổi từ khóa hoặc thêm mã mới vào danh mục."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 md:hidden",
				children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground",
								children: m.sku
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMenu, {
							onEdit: () => {
								setEditingMat(m);
								setMatOpen(true);
							},
							onDelete: () => setDeletingMat(m)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Nhóm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: catName(m.categoryId) })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Đơn vị"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.unit })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Tồn tối thiểu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: formatNumber(m.minStock)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Vị trí"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.location || "—" })] })
						]
					})]
				}, m.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto rounded-xl bg-card shadow-card md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[52rem] text-sm",
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
								children: "ĐVT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Min"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Đơn giá"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Vị trí"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-12 px-3 py-3 font-medium" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0 hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-mono text-xs",
								children: m.sku
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-medium",
								children: m.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted-foreground",
								children: catName(m.categoryId)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: m.unit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: formatNumber(m.minStock)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-mono tabular-nums",
								children: formatVnd(m.lastUnitPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: m.location || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMenu, {
									onEdit: () => {
										setEditingMat(m);
										setMatOpen(true);
									},
									onDelete: () => setDeletingMat(m)
								})
							})
						]
					}, m.id)) })]
				})
			})] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: categories.map((c) => {
					const count = materials.filter((m) => m.categoryId === c.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: c.description || "Không có mô tả"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMenu, {
								onEdit: () => {
									setEditingCat(c);
									setCatOpen(true);
								},
								onDelete: () => setDeletingCat(c)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm tabular-nums text-muted-foreground",
							children: [count, " mã vật tư"]
						})]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialDialog, {
				open: matOpen,
				onOpenChange: (v) => {
					setMatOpen(v);
					if (!v) setEditingMat(null);
				},
				material: editingMat
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryDialog, {
				open: catOpen,
				onOpenChange: (v) => {
					setCatOpen(v);
					if (!v) setEditingCat(null);
				},
				category: editingCat
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingMat,
				onOpenChange: (v) => !v && setDeletingMat(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Xóa vật tư?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: deletingMat ? `Xóa ${deletingMat.name} khỏi danh mục. Không xóa được nếu đã phát sinh tồn kho.` : "" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Hủy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: confirmDeleteMat,
					children: "Xóa"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingCat,
				onOpenChange: (v) => !v && setDeletingCat(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Xóa nhóm hàng?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: deletingCat ? `Xóa nhóm ${deletingCat.name}. Không xóa được nếu vẫn còn vật tư trong nhóm.` : "" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Hủy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: confirmDeleteCat,
					children: "Xóa"
				})] })] })
			})
		]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-10 flex-1 rounded-md bg-card px-3 text-sm font-medium shadow-card" : "h-10 flex-1 rounded-md px-3 text-sm font-medium text-muted-foreground",
		children
	});
}
function RowMenu({ onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon-sm",
			"aria-label": "Thao tác",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onClick: onEdit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Sửa"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onClick: onDelete,
			className: "text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Xóa"]
		})]
	})] });
}
//#endregion
export { CatalogPage as component };

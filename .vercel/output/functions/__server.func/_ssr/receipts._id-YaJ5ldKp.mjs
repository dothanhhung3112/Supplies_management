import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as Trash2, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useWarehouseStore, g as formatDateTime, n as Route$1, u as Button } from "./router-D_68d68J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-C967yPdJ.mjs";
import { t as Badge } from "./badge-B0oE1gOu.mjs";
import { n as ReceiptReadOnlyMeta, t as ReceiptForm } from "./receipt-form-DeTde2zP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts._id-YaJ5ldKp.js
var import_jsx_runtime = require_jsx_runtime();
function ReceiptDetailPage() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const receipt = useWarehouseStore((s) => s.receipts.find((r) => r.id === id));
	const deleteReceipt = useWarehouseStore((s) => s.deleteReceipt);
	if (!receipt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Không tìm thấy phiếu này."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/receipts",
				children: "Quay lại danh sách"
			})
		})]
	});
	const current = receipt;
	function onDelete() {
		const err = deleteReceipt(current.id);
		if (err) {
			toast.error(err);
			return;
		}
		toast.success("Đã xóa phiếu nháp.");
		navigate({ to: "/receipts" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				className: "-ml-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/receipts",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Phiếu nhập"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: receipt.code,
				title: receipt.status === "posted" ? "Phiếu đã ghi sổ" : "Phiếu nháp",
				description: receipt.status === "posted" && receipt.postedAt ? `Ghi sổ lúc ${formatDateTime(receipt.postedAt)} · ${receipt.warehouse}` : `${receipt.warehouse}. Chỉnh sửa rồi ghi sổ để cộng tồn.`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: receipt.status === "posted" ? "success" : "secondary",
						children: receipt.status === "posted" ? "Đã ghi sổ" : "Nháp"
					}), receipt.status === "draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Xóa nháp"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Xóa phiếu nháp?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Phiếu ",
						receipt.code,
						" sẽ bị xóa. Thao tác này không hoàn tác được."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Hủy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: onDelete,
						children: "Xóa"
					})] })] })] }) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptReadOnlyMeta, { receipt }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptForm, { receipt })
		]
	});
}
//#endregion
export { ReceiptDetailPage as component };

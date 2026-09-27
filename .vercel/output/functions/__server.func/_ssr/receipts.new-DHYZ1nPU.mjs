import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { u as Button } from "./router-D_68d68J.mjs";
import { t as PageHeader } from "./page-header-If8l2oMD.mjs";
import { t as ReceiptForm } from "./receipt-form-DeTde2zP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts.new-DHYZ1nPU.js
var import_jsx_runtime = require_jsx_runtime();
function NewReceiptPage() {
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
				eyebrow: "Nhập kho",
				title: "Tạo phiếu nhập",
				description: "Chọn vật tư, số lượng và đơn giá. Lưu nháp hoặc ghi sổ để cộng tồn ngay."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptForm, {})
		]
	});
}
//#endregion
export { NewReceiptPage as component };

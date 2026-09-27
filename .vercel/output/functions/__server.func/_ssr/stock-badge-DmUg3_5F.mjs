import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./badge-B0oE1gOu.mjs";
import { o as stockStatus, s as stockStatusLabel } from "./selectors-BQiVadiX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-badge-DmUg3_5F.js
var import_jsx_runtime = require_jsx_runtime();
function StockBadge({ qty, minStock }) {
	const status = stockStatus(qty, minStock);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "ok" ? "success" : status === "low" ? "warning" : "danger",
		children: stockStatusLabel(status)
	});
}
//#endregion
export { StockBadge as t };

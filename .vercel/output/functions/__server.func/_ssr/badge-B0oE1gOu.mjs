import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as cn } from "./router-D_68d68J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-B0oE1gOu.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-foreground",
		success: "border-transparent bg-success/15 text-success",
		warning: "border-transparent bg-warning/15 text-warning",
		danger: "border-transparent bg-destructive/15 text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };

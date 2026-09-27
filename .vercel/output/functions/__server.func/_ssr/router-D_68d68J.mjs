import { i as __toESM } from "../_runtime.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as parseISO, r as format, t as vi } from "../_libs/date-fns.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, d as DialogClose, f as DialogContent$1, g as DialogTitle$1, h as DialogPortal$1, j as Slot, m as DialogOverlay$1, p as DialogDescription$1, u as Dialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Menu, f as LayoutDashboard, h as ClipboardList, l as Package, n as Warehouse, o as Search, p as History, r as TriangleAlert, t as X, u as PackagePlus, y as Boxes } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-CNPcsmh8.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
var categories = [
	{
		id: "cat_dien",
		name: "Vật liệu điện",
		description: "Dây điện, aptomat, ống luồn, đèn"
	},
	{
		id: "cat_nuoc",
		name: "Ống nước & phụ kiện",
		description: "Ống PVC, PPR, van, co, tê"
	},
	{
		id: "cat_dungcu",
		name: "Dụng cụ thi công",
		description: "Máy, kìm, thước, dao cắt"
	},
	{
		id: "cat_atld",
		name: "An toàn lao động",
		description: "Mũ, găng, giày, dây đai"
	},
	{
		id: "cat_tieuhao",
		name: "Vật tư tiêu hao",
		description: "Băng keo, đinh, keo, giấy nhám"
	},
	{
		id: "cat_kimloai",
		name: "Kim loại & bulong",
		description: "Thép, bulong, êcu, long đen"
	}
];
var materials = [
	{
		id: "mat_cv25",
		sku: "DIEN-CV-25",
		name: "Dây điện CV 2.5mm",
		categoryId: "cat_dien",
		unit: "cuộn",
		minStock: 8,
		location: "Kệ A1",
		note: "Cadivi, 100m/cuộn",
		lastUnitPrice: 85e4,
		createdAt: "2026-03-02T08:00:00.000Z"
	},
	{
		id: "mat_cv15",
		sku: "DIEN-CV-15",
		name: "Dây điện CV 1.5mm",
		categoryId: "cat_dien",
		unit: "cuộn",
		minStock: 10,
		location: "Kệ A1",
		note: "Cadivi, 100m/cuộn",
		lastUnitPrice: 56e4,
		createdAt: "2026-03-02T08:00:00.000Z"
	},
	{
		id: "mat_mcb20",
		sku: "DIEN-MCB-20",
		name: "Aptomat 2P 20A",
		categoryId: "cat_dien",
		unit: "cái",
		minStock: 15,
		location: "Kệ A2",
		note: "Schneider",
		lastUnitPrice: 185e3,
		createdAt: "2026-03-04T08:00:00.000Z"
	},
	{
		id: "mat_ong16",
		sku: "DIEN-ONG-16",
		name: "Ống luồn điện D16",
		categoryId: "cat_dien",
		unit: "cây",
		minStock: 40,
		location: "Kệ A3",
		note: "Sino, 2.9m",
		lastUnitPrice: 18e3,
		createdAt: "2026-03-04T08:00:00.000Z"
	},
	{
		id: "mat_denled",
		sku: "DIEN-LED-18",
		name: "Đèn LED tuýp 1.2m 18W",
		categoryId: "cat_dien",
		unit: "cái",
		minStock: 20,
		location: "Kệ A4",
		note: "Rạng Đông",
		lastUnitPrice: 72e3,
		createdAt: "2026-04-01T08:00:00.000Z"
	},
	{
		id: "mat_pvc21",
		sku: "NUOC-PVC-21",
		name: "Ống PVC D21",
		categoryId: "cat_nuoc",
		unit: "cây",
		minStock: 50,
		location: "Bãi B1",
		note: "Tiền Phong, 4.2m",
		lastUnitPrice: 45e3,
		createdAt: "2026-03-06T08:00:00.000Z"
	},
	{
		id: "mat_pvc27",
		sku: "NUOC-PVC-27",
		name: "Ống PVC D27",
		categoryId: "cat_nuoc",
		unit: "cây",
		minStock: 30,
		location: "Bãi B1",
		note: "Tiền Phong, 4.2m",
		lastUnitPrice: 62e3,
		createdAt: "2026-03-06T08:00:00.000Z"
	},
	{
		id: "mat_van21",
		sku: "NUOC-VAN-21",
		name: "Van khóa nước D21",
		categoryId: "cat_nuoc",
		unit: "cái",
		minStock: 20,
		location: "Kệ B2",
		note: "Miha",
		lastUnitPrice: 28e3,
		createdAt: "2026-03-10T08:00:00.000Z"
	},
	{
		id: "mat_co21",
		sku: "NUOC-CO-21",
		name: "Co 90 độ PVC D21",
		categoryId: "cat_nuoc",
		unit: "cái",
		minStock: 40,
		location: "Kệ B2",
		note: "",
		lastUnitPrice: 3500,
		createdAt: "2026-03-10T08:00:00.000Z"
	},
	{
		id: "mat_ppr20",
		sku: "NUOC-PPR-20",
		name: "Ống PPR D20",
		categoryId: "cat_nuoc",
		unit: "cây",
		minStock: 20,
		location: "Bãi B3",
		note: "Wavin",
		lastUnitPrice: 89e3,
		createdAt: "2026-04-12T08:00:00.000Z"
	},
	{
		id: "mat_khoan",
		sku: "DC-KHOAN-13",
		name: "Máy khoan pin 13mm",
		categoryId: "cat_dungcu",
		unit: "cái",
		minStock: 2,
		location: "Tủ C1",
		note: "Makita",
		lastUnitPrice: 245e4,
		createdAt: "2026-03-15T08:00:00.000Z"
	},
	{
		id: "mat_kim",
		sku: "DC-KIM-08",
		name: "Kìm cắt dây 8 inch",
		categoryId: "cat_dungcu",
		unit: "cái",
		minStock: 6,
		location: "Tủ C2",
		note: "",
		lastUnitPrice: 95e3,
		createdAt: "2026-03-15T08:00:00.000Z"
	},
	{
		id: "mat_thuoc",
		sku: "DC-THUOC-5",
		name: "Thước kéo 5m",
		categoryId: "cat_dungcu",
		unit: "cái",
		minStock: 8,
		location: "Tủ C2",
		note: "Stanley",
		lastUnitPrice: 78e3,
		createdAt: "2026-04-02T08:00:00.000Z"
	},
	{
		id: "mat_mu",
		sku: "AT-MU-01",
		name: "Mũ bảo hộ",
		categoryId: "cat_atld",
		unit: "cái",
		minStock: 20,
		location: "Kệ D1",
		note: "Màu vàng, có quai",
		lastUnitPrice: 65e3,
		createdAt: "2026-03-08T08:00:00.000Z"
	},
	{
		id: "mat_gang",
		sku: "AT-GANG-VL",
		name: "Găng tay vải bạt",
		categoryId: "cat_atld",
		unit: "đôi",
		minStock: 30,
		location: "Kệ D1",
		note: "",
		lastUnitPrice: 12e3,
		createdAt: "2026-03-08T08:00:00.000Z"
	},
	{
		id: "mat_giay",
		sku: "AT-GIAY-M",
		name: "Giày bảo hộ mũi thép",
		categoryId: "cat_atld",
		unit: "đôi",
		minStock: 10,
		location: "Kệ D2",
		note: "Size 39–43",
		lastUnitPrice: 32e4,
		createdAt: "2026-04-18T08:00:00.000Z"
	},
	{
		id: "mat_daydai",
		sku: "AT-DAI-01",
		name: "Dây đai an toàn",
		categoryId: "cat_atld",
		unit: "bộ",
		minStock: 4,
		location: "Kệ D2",
		note: "",
		lastUnitPrice: 28e4,
		createdAt: "2026-04-18T08:00:00.000Z"
	},
	{
		id: "mat_bangkeo",
		sku: "TH-BANG-48",
		name: "Băng keo điện 18m",
		categoryId: "cat_tieuhao",
		unit: "cuộn",
		minStock: 40,
		location: "Kệ E1",
		note: "Nitto",
		lastUnitPrice: 15e3,
		createdAt: "2026-03-20T08:00:00.000Z"
	},
	{
		id: "mat_din",
		sku: "TH-DIN-5",
		name: "Đinh bê tông 5cm",
		categoryId: "cat_tieuhao",
		unit: "hộp",
		minStock: 12,
		location: "Kệ E1",
		note: "100 cái/hộp",
		lastUnitPrice: 42e3,
		createdAt: "2026-03-20T08:00:00.000Z"
	},
	{
		id: "mat_keo",
		sku: "TH-KEO-SIL",
		name: "Keo silicone trong",
		categoryId: "cat_tieuhao",
		unit: "chai",
		minStock: 16,
		location: "Kệ E2",
		note: "Apollo",
		lastUnitPrice: 38e3,
		createdAt: "2026-05-01T08:00:00.000Z"
	},
	{
		id: "mat_nham",
		sku: "TH-NHAM-80",
		name: "Giấy nhám P80",
		categoryId: "cat_tieuhao",
		unit: "tờ",
		minStock: 50,
		location: "Kệ E2",
		note: "",
		lastUnitPrice: 2500,
		createdAt: "2026-05-01T08:00:00.000Z"
	},
	{
		id: "mat_bulong",
		sku: "KL-BL-M10",
		name: "Bu lông M10x50",
		categoryId: "cat_kimloai",
		unit: "hộp",
		minStock: 8,
		location: "Kệ F1",
		note: "50 bộ/hộp",
		lastUnitPrice: 35e3,
		createdAt: "2026-03-22T08:00:00.000Z"
	},
	{
		id: "mat_thep6",
		sku: "KL-THEP-6",
		name: "Thép tròn D6",
		categoryId: "cat_kimloai",
		unit: "kg",
		minStock: 80,
		location: "Bãi F2",
		note: "Hòa Phát",
		lastUnitPrice: 14500,
		createdAt: "2026-03-22T08:00:00.000Z"
	},
	{
		id: "mat_thep8",
		sku: "KL-THEP-8",
		name: "Thép tròn D8",
		categoryId: "cat_kimloai",
		unit: "kg",
		minStock: 80,
		location: "Bãi F2",
		note: "Hòa Phát",
		lastUnitPrice: 14800,
		createdAt: "2026-04-08T08:00:00.000Z"
	}
];
var receipts = [
	{
		id: "rcpt_001",
		code: "PN-2026-0001",
		date: "2026-06-12",
		supplier: "Công ty TNHH Điện Việt",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "Nhập đợt 1 công trình Block A",
		status: "posted",
		createdAt: "2026-06-12T09:10:00.000Z",
		postedAt: "2026-06-12T09:18:00.000Z",
		lines: [
			{
				id: "ln_001a",
				materialId: "mat_cv25",
				quantity: 20,
				unitPrice: 85e4
			},
			{
				id: "ln_001b",
				materialId: "mat_cv15",
				quantity: 16,
				unitPrice: 56e4
			},
			{
				id: "ln_001c",
				materialId: "mat_mcb20",
				quantity: 40,
				unitPrice: 185e3
			},
			{
				id: "ln_001d",
				materialId: "mat_ong16",
				quantity: 80,
				unitPrice: 18e3
			}
		]
	},
	{
		id: "rcpt_002",
		code: "PN-2026-0002",
		date: "2026-07-03",
		supplier: "Công ty CP Ống nhựa Tiền Phong",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "",
		status: "posted",
		createdAt: "2026-07-03T10:02:00.000Z",
		postedAt: "2026-07-03T10:20:00.000Z",
		lines: [
			{
				id: "ln_002a",
				materialId: "mat_pvc21",
				quantity: 120,
				unitPrice: 45e3
			},
			{
				id: "ln_002b",
				materialId: "mat_pvc27",
				quantity: 60,
				unitPrice: 62e3
			},
			{
				id: "ln_002c",
				materialId: "mat_van21",
				quantity: 50,
				unitPrice: 28e3
			},
			{
				id: "ln_002d",
				materialId: "mat_co21",
				quantity: 200,
				unitPrice: 3500
			}
		]
	},
	{
		id: "rcpt_003",
		code: "PN-2026-0003",
		date: "2026-07-21",
		supplier: "Đại lý 3M An toàn",
		warehouse: "Kho phụ — Bãi A",
		note: "Bổ sung bảo hộ cho đội mới",
		status: "posted",
		createdAt: "2026-07-21T08:40:00.000Z",
		postedAt: "2026-07-21T08:55:00.000Z",
		lines: [
			{
				id: "ln_003a",
				materialId: "mat_mu",
				quantity: 12,
				unitPrice: 65e3
			},
			{
				id: "ln_003b",
				materialId: "mat_gang",
				quantity: 40,
				unitPrice: 12e3
			},
			{
				id: "ln_003c",
				materialId: "mat_giay",
				quantity: 8,
				unitPrice: 32e4
			}
		]
	},
	{
		id: "rcpt_004",
		code: "PN-2026-0004",
		date: "2026-08-09",
		supplier: "Công ty CP Thép Hòa Phát",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "",
		status: "posted",
		createdAt: "2026-08-09T13:15:00.000Z",
		postedAt: "2026-08-09T13:30:00.000Z",
		lines: [
			{
				id: "ln_004a",
				materialId: "mat_thep6",
				quantity: 250,
				unitPrice: 14500
			},
			{
				id: "ln_004b",
				materialId: "mat_thep8",
				quantity: 180,
				unitPrice: 14800
			},
			{
				id: "ln_004c",
				materialId: "mat_bulong",
				quantity: 20,
				unitPrice: 35e3
			}
		]
	},
	{
		id: "rcpt_005",
		code: "PN-2026-0005",
		date: "2026-08-28",
		supplier: "Công ty TNHH Dụng cụ Toàn Phát",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "Mua máy khoan thay thế",
		status: "posted",
		createdAt: "2026-08-28T09:00:00.000Z",
		postedAt: "2026-08-28T09:12:00.000Z",
		lines: [
			{
				id: "ln_005a",
				materialId: "mat_khoan",
				quantity: 2,
				unitPrice: 245e4
			},
			{
				id: "ln_005b",
				materialId: "mat_kim",
				quantity: 10,
				unitPrice: 95e3
			},
			{
				id: "ln_005c",
				materialId: "mat_thuoc",
				quantity: 12,
				unitPrice: 78e3
			}
		]
	},
	{
		id: "rcpt_006",
		code: "PN-2026-0006",
		date: "2026-09-11",
		supplier: "Công ty TNHH Điện Việt",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "Bổ sung đèn LED tầng 3–5",
		status: "posted",
		createdAt: "2026-09-11T14:22:00.000Z",
		postedAt: "2026-09-11T14:40:00.000Z",
		lines: [
			{
				id: "ln_006a",
				materialId: "mat_denled",
				quantity: 48,
				unitPrice: 72e3
			},
			{
				id: "ln_006b",
				materialId: "mat_cv25",
				quantity: 8,
				unitPrice: 86e4
			},
			{
				id: "ln_006c",
				materialId: "mat_bangkeo",
				quantity: 60,
				unitPrice: 15e3
			}
		]
	},
	{
		id: "rcpt_007",
		code: "PN-2026-0007",
		date: "2026-09-22",
		supplier: "Siêu thị vật tư Hải Linh",
		warehouse: "Kho phụ — Bãi A",
		note: "Nháp — chờ đối chiếu báo giá",
		status: "draft",
		createdAt: "2026-09-22T11:05:00.000Z",
		postedAt: null,
		lines: [
			{
				id: "ln_007a",
				materialId: "mat_keo",
				quantity: 24,
				unitPrice: 38e3
			},
			{
				id: "ln_007b",
				materialId: "mat_nham",
				quantity: 80,
				unitPrice: 2500
			},
			{
				id: "ln_007c",
				materialId: "mat_din",
				quantity: 10,
				unitPrice: 42e3
			}
		]
	},
	{
		id: "rcpt_008",
		code: "PN-2026-0008",
		date: "2026-09-26",
		supplier: "Đại lý 3M An toàn",
		warehouse: "Kho chính — Nhà xưởng A",
		note: "Nháp — bổ sung dây đai",
		status: "draft",
		createdAt: "2026-09-26T16:40:00.000Z",
		postedAt: null,
		lines: [{
			id: "ln_008a",
			materialId: "mat_daydai",
			quantity: 6,
			unitPrice: 28e4
		}, {
			id: "ln_008b",
			materialId: "mat_mu",
			quantity: 10,
			unitPrice: 65e3
		}]
	}
];
function movementsFromReceipts(list) {
	return list.filter((r) => r.status === "posted" && r.postedAt).flatMap((r) => r.lines.map((line) => ({
		id: `mv_${line.id}`,
		materialId: line.materialId,
		type: "in",
		quantity: line.quantity,
		unitPrice: line.unitPrice,
		receiptId: r.id,
		note: `Nhập kho ${r.code}`,
		createdAt: r.postedAt
	})));
}
var adjustments = [
	{
		id: "mv_adj_1",
		materialId: "mat_mu",
		type: "adjust",
		quantity: -4,
		unitPrice: 65e3,
		receiptId: null,
		note: "Cấp phát đội Block A — tháng 8",
		createdAt: "2026-08-15T10:00:00.000Z"
	},
	{
		id: "mv_adj_2",
		materialId: "mat_gang",
		type: "adjust",
		quantity: -18,
		unitPrice: 12e3,
		receiptId: null,
		note: "Cấp phát định kỳ",
		createdAt: "2026-08-15T10:02:00.000Z"
	},
	{
		id: "mv_adj_3",
		materialId: "mat_pvc21",
		type: "adjust",
		quantity: -25,
		unitPrice: 45e3,
		receiptId: null,
		note: "Xuất công trình — hao hụt cắt",
		createdAt: "2026-09-05T15:20:00.000Z"
	},
	{
		id: "mv_adj_4",
		materialId: "mat_thep6",
		type: "adjust",
		quantity: 12,
		unitPrice: 14500,
		receiptId: null,
		note: "Kiểm kê dư — điều chỉnh tăng",
		createdAt: "2026-09-18T09:30:00.000Z"
	}
];
var seedData = {
	categories,
	materials,
	receipts,
	movements: [...movementsFromReceipts(receipts), ...adjustments]
};
var WAREHOUSES = [
	"Kho chính — Nhà xưởng A",
	"Kho phụ — Bãi A",
	"Kho công trình — Block B"
];
var UNITS = [
	"cái",
	"bộ",
	"đôi",
	"cuộn",
	"cây",
	"hộp",
	"thùng",
	"chai",
	"tờ",
	"kg",
	"mét",
	"bao"
];
function nextReceiptCode(receipts, date) {
	const prefix = `PN-${date.slice(0, 4) || String((/* @__PURE__ */ new Date()).getFullYear())}-`;
	let max = 0;
	for (const r of receipts) {
		if (!r.code.startsWith(prefix)) continue;
		const n = Number(r.code.slice(prefix.length));
		if (Number.isFinite(n) && n > max) max = n;
	}
	return `${prefix}${String(max + 1).padStart(4, "0")}`;
}
function applyLastPrices(materials, lines) {
	const priceById = new Map(lines.map((l) => [l.materialId, l.unitPrice]));
	return materials.map((m) => {
		const price = priceById.get(m.id);
		return price == null ? m : {
			...m,
			lastUnitPrice: price
		};
	});
}
var useWarehouseStore = create()(persist((set, get) => ({
	...seedData,
	addCategory: (input) => {
		const id = uid("cat");
		set((s) => ({ categories: [...s.categories, {
			id,
			...input
		}] }));
		return id;
	},
	updateCategory: (id, input) => {
		set((s) => ({ categories: s.categories.map((c) => c.id === id ? {
			...c,
			...input
		} : c) }));
	},
	deleteCategory: (id) => {
		if (get().materials.some((m) => m.categoryId === id)) return "Không thể xóa nhóm đang có vật tư.";
		set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
		return null;
	},
	addMaterial: (input) => {
		const id = uid("mat");
		set((s) => ({ materials: [...s.materials, {
			...input,
			id,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}] }));
		return id;
	},
	updateMaterial: (id, input) => {
		set((s) => ({ materials: s.materials.map((m) => m.id === id ? {
			...m,
			...input
		} : m) }));
	},
	deleteMaterial: (id) => {
		const { receipts, movements } = get();
		if (movements.some((m) => m.materialId === id)) return "Không thể xóa vật tư đã phát sinh tồn kho.";
		if (receipts.some((r) => r.lines.some((l) => l.materialId === id))) return "Không thể xóa vật tư đang nằm trên phiếu nhập.";
		set((s) => ({ materials: s.materials.filter((m) => m.id !== id) }));
		return null;
	},
	saveReceipt: (input, existingId) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		if (existingId) {
			const current = get().receipts.find((r) => r.id === existingId);
			if (!current) return existingId;
			if (current.status === "posted") return existingId;
			set((s) => ({ receipts: s.receipts.map((r) => r.id === existingId ? {
				...r,
				date: input.date,
				supplier: input.supplier,
				warehouse: input.warehouse,
				note: input.note,
				lines: input.lines
			} : r) }));
			return existingId;
		}
		const id = uid("rcpt");
		const code = input.code?.trim() || nextReceiptCode(get().receipts, input.date);
		set((s) => ({ receipts: [{
			id,
			code,
			date: input.date,
			supplier: input.supplier,
			warehouse: input.warehouse,
			note: input.note,
			lines: input.lines,
			status: "draft",
			createdAt: now,
			postedAt: null
		}, ...s.receipts] }));
		return id;
	},
	postReceipt: (id) => {
		const receipt = get().receipts.find((r) => r.id === id);
		if (!receipt) return "Không tìm thấy phiếu.";
		if (receipt.status === "posted") return "Phiếu đã ghi sổ.";
		if (!receipt.supplier.trim()) return "Nhập nhà cung cấp trước khi ghi sổ.";
		if (receipt.lines.length === 0) return "Phiếu chưa có dòng vật tư.";
		if (receipt.lines.some((l) => !l.materialId || l.quantity <= 0)) return "Mỗi dòng cần chọn vật tư và số lượng lớn hơn 0.";
		const postedAt = (/* @__PURE__ */ new Date()).toISOString();
		const movements = receipt.lines.map((line) => ({
			id: uid("mv"),
			materialId: line.materialId,
			type: "in",
			quantity: line.quantity,
			unitPrice: line.unitPrice,
			receiptId: receipt.id,
			note: `Nhập kho ${receipt.code}`,
			createdAt: postedAt
		}));
		set((s) => ({
			receipts: s.receipts.map((r) => r.id === id ? {
				...r,
				status: "posted",
				postedAt
			} : r),
			movements: [...s.movements, ...movements],
			materials: applyLastPrices(s.materials, receipt.lines)
		}));
		return null;
	},
	deleteReceipt: (id) => {
		const receipt = get().receipts.find((r) => r.id === id);
		if (!receipt) return "Không tìm thấy phiếu.";
		if (receipt.status === "posted") return "Không thể xóa phiếu đã ghi sổ.";
		set((s) => ({ receipts: s.receipts.filter((r) => r.id !== id) }));
		return null;
	},
	adjustStock: (materialId, quantity, note) => {
		if (!materialId) return "Chọn vật tư.";
		if (!quantity || quantity === 0) return "Số lượng điều chỉnh phải khác 0.";
		if (!note.trim()) return "Nhập lý do điều chỉnh.";
		const material = get().materials.find((m) => m.id === materialId);
		if (!material) return "Không tìm thấy vật tư.";
		set((s) => ({ movements: [...s.movements, {
			id: uid("mv"),
			materialId,
			type: "adjust",
			quantity,
			unitPrice: material.lastUnitPrice,
			receiptId: null,
			note: note.trim(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}] }));
		return null;
	}
}), {
	name: "khovt-warehouse-v1",
	skipHydration: true,
	partialize: (s) => ({
		categories: s.categories,
		materials: s.materials,
		receipts: s.receipts,
		movements: s.movements
	})
}));
function formatVnd(value) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0
	}).format(value);
}
function formatNumber(value) {
	return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
}
function formatQty(value, unit) {
	const n = formatNumber(value);
	return unit ? `${n} ${unit}` : n;
}
function toDate(iso) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return parseISO(`${iso}T12:00:00`);
	return parseISO(iso);
}
function formatDate(iso) {
	try {
		return format(toDate(iso), "dd/MM/yyyy", { locale: vi });
	} catch {
		return iso;
	}
}
function formatDateTime(iso) {
	try {
		return format(toDate(iso), "dd/MM/yyyy HH:mm", { locale: vi });
	} catch {
		return iso;
	}
}
function todayIsoDate() {
	return format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D_68d68J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-card text-foreground hover:bg-secondary",
			ghost: "hover:bg-secondary hover:text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3",
			lg: "h-12 rounded-lg px-6",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-sidebar/50", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var SheetContent = import_react.forwardRef(({ side = "left", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed z-50 gap-4 bg-sidebar p-6 text-sidebar-foreground shadow-card", side === "left" && "inset-y-0 left-0 h-full w-72", side === "right" && "inset-y-0 right-0 h-full w-72", side === "bottom" && "inset-x-0 bottom-0 rounded-t-xl", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
			className: "sr-only",
			children: "Menu"
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-4 top-4 rounded-sm p-1 text-sidebar-muted opacity-70 hover:opacity-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Đóng"
			})]
		})
	]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		toastOptions: { classNames: {
			toast: "bg-card text-card-foreground border-border shadow-card font-sans",
			title: "text-foreground",
			description: "text-muted-foreground"
		} }
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-sidebar/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg max-h-[85vh] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-xl bg-card p-6 text-card-foreground shadow-card duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Đóng"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-snug", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Ctx = (0, import_react.createContext)({
	open: false,
	setOpen: () => {}
});
function SearchProvider({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			open,
			setOpen
		},
		children
	});
}
function useSearchOpen() {
	return (0, import_react.useContext)(Ctx);
}
var PAGES = [
	{
		to: "/",
		label: "Tổng quan",
		icon: LayoutDashboard
	},
	{
		to: "/catalog",
		label: "Danh mục vật tư",
		icon: Boxes
	},
	{
		to: "/inventory",
		label: "Tồn kho",
		icon: Warehouse
	},
	{
		to: "/receipts",
		label: "Phiếu nhập kho",
		icon: ClipboardList
	},
	{
		to: "/receipts/new",
		label: "Tạo phiếu nhập",
		icon: ClipboardList
	},
	{
		to: "/history",
		label: "Lịch sử",
		icon: History
	}
];
function SearchCommand() {
	const { open, setOpen } = useSearchOpen();
	const [q, setQ] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const materials = useWarehouseStore((s) => s.materials);
	const receipts = useWarehouseStore((s) => s.receipts);
	const needle = q.trim().toLowerCase();
	const pageHits = (0, import_react.useMemo)(() => PAGES.filter((p) => !needle || p.label.toLowerCase().includes(needle)), [needle]);
	const materialHits = (0, import_react.useMemo)(() => {
		if (!needle) return materials.slice(0, 6);
		return materials.filter((m) => `${m.sku} ${m.name}`.toLowerCase().includes(needle)).slice(0, 8);
	}, [materials, needle]);
	const receiptHits = (0, import_react.useMemo)(() => {
		if (!needle) return receipts.slice(0, 5);
		return receipts.filter((r) => `${r.code} ${r.supplier} ${r.note}`.toLowerCase().includes(needle)).slice(0, 8);
	}, [receipts, needle]);
	function go(to) {
		setOpen(false);
		setQ("");
		navigate({ to });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			setOpen(v);
			if (!v) setQ("");
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg gap-0 p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Tìm kiếm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Tìm vật tư, phiếu nhập và trang"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Tìm vật tư, phiếu nhập, trang…",
						className: "h-12 border-0 shadow-none focus-visible:ring-0"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-96 overflow-y-auto p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Trang",
							children: pageHits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "size-4" }),
								onClick: () => go(p.to),
								children: p.label
							}, p.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Vật tư",
							children: materialHits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-3 text-sm text-muted-foreground",
								children: "Không có vật tư."
							}) : materialHits.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }),
								hint: m.sku,
								onClick: () => go("/inventory"),
								children: m.name
							}, m.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Phiếu nhập",
							children: receiptHits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-3 text-sm text-muted-foreground",
								children: "Không có phiếu."
							}) : receiptHits.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" }),
								hint: `${formatDate(r.date)} · ${r.supplier}`,
								onClick: () => go(`/receipts/${r.id}`),
								children: r.code
							}, r.id))
						})
					]
				})
			]
		})
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col",
			children
		})]
	});
}
function Row({ icon, hint, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate",
				children
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Tổng quan",
		icon: LayoutDashboard
	},
	{
		to: "/catalog",
		label: "Danh mục",
		icon: Boxes
	},
	{
		to: "/inventory",
		label: "Tồn kho",
		icon: Warehouse
	},
	{
		to: "/receipts",
		label: "Phiếu nhập",
		icon: ClipboardList
	},
	{
		to: "/history",
		label: "Lịch sử",
		icon: History
	}
];
function pathActive(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-9 items-center justify-center rounded-md bg-primary-foreground/10 text-sidebar-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-5" })
		}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm font-semibold tracking-tight",
				children: "KhoVT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-sidebar-muted",
				children: "Nhập kho vật tư"
			})]
		})]
	});
}
function NavLinks({ pathname, onNavigate, variant }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = pathActive(pathname, item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150", variant === "sidebar" && (active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"), variant === "mobile-sheet" && (active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground")),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
			}, item.to);
		})
	});
}
function Sidebar({ pathname }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 items-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
					pathname,
					variant: "sidebar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-sidebar-muted",
					children: "Sổ kho nội bộ. Dữ liệu lưu trên trình duyệt này."
				})
			})
		]
	});
}
function MobileNav({ pathname }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-5",
			children: NAV.map((item) => {
				const active = pathActive(pathname, item.to);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					className: cn("flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
				}) }, item.to);
			})
		})
	});
}
function ShellSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden w-60 bg-sidebar lg:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 rounded-md bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl bg-card shadow-card" }, i))
			})]
		})]
	});
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [ready, setReady] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const { setOpen: setSearchOpen } = useSearchOpen();
	(0, import_react.useEffect)(() => {
		const unsub = useWarehouseStore.persist.onFinishHydration(() => setReady(true));
		useWarehouseStore.persist.rehydrate();
		if (useWarehouseStore.persist.hasHydrated()) setReady(true);
		return unsub;
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { pathname }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setMenuOpen(true),
							"aria-label": "Mở menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSearchOpen(true),
							className: "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-sm text-muted-foreground shadow-card transition-[box-shadow] duration-150 hover:shadow-card-hover lg:max-w-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: "Tìm vật tư, phiếu nhập…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "ml-auto hidden rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline",
									children: "⌘K"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/receipts/new",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "size-4" }), "Tạo phiếu nhập"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "icon",
							className: "sm:hidden",
							"aria-label": "Tạo phiếu nhập",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/receipts/new",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "size-4" })
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, { pathname }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: menuOpen,
				onOpenChange: setMenuOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "flex flex-col bg-sidebar p-0 text-sidebar-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-16 items-center px-4 pr-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
							pathname,
							onNavigate: () => setMenuOpen(false),
							variant: "mobile-sheet"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCommand, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
var styles_default = "/assets/styles-C_ApSTzy.css";
var APP_NAME = "KhoVT — Quản lý nhập kho vật tư";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Quản lý danh mục, tồn kho, phiếu nhập kho và lịch sử vật tư."
			},
			{
				name: "theme-color",
				content: "#1e3d32"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "vi",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-C5fjlggt.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./catalog-BBFe4iWY.mjs");
var Route$6 = createFileRoute("/catalog")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./history-BsRvPfAU.mjs");
var Route$5 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./inventory-DzDuJflg.mjs");
var Route$4 = createFileRoute("/inventory")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./receipts-D901mygN.mjs");
var Route$3 = createFileRoute("/receipts")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./receipts.index-Drn9cmGx.mjs");
var Route$2 = createFileRoute("/receipts/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./receipts._id-YaJ5ldKp.mjs");
var Route$1 = createFileRoute("/receipts/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./receipts.new-DHYZ1nPU.mjs");
var Route = createFileRoute("/receipts/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$8
});
var CatalogRoute = Route$6.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => Route$8
});
var HistoryRoute = Route$5.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$8
});
var InventoryRoute = Route$4.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => Route$8
});
var ReceiptsRoute = Route$3.update({
	id: "/receipts",
	path: "/receipts",
	getParentRoute: () => Route$8
});
var ReceiptsIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => ReceiptsRoute
});
var ReceiptsRouteChildren = {
	ReceiptsIdRoute: Route$1.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => ReceiptsRoute
	}),
	ReceiptsNewRoute: Route.update({
		id: "/new",
		path: "/new",
		getParentRoute: () => ReceiptsRoute
	}),
	ReceiptsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CatalogRoute,
	HistoryRoute,
	InventoryRoute,
	ReceiptsRoute: ReceiptsRoute._addFileChildren(ReceiptsRouteChildren)
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useWarehouseStore as S, formatNumber as _, DialogContent as a, todayIsoDate as b, DialogHeader as c, buttonVariants as d, UNITS as f, formatDateTime as g, formatDate as h, Dialog as i, DialogTitle as l, cn as m, Route$1 as n, DialogDescription as o, WAREHOUSES as p, Input as r, DialogFooter as s, router_exports as t, Button as u, formatQty as v, uid as x, formatVnd as y };

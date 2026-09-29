import type { Category, Material, Movement, Receipt, Warehouse } from "./types";

// Khai báo Ở NGOÀI component / hook → tham chiếu cố định suốt vòng đời app,
// nên dùng làm fallback cho `data?.xxx ?? EMPTY_XXX` không bao giờ đổi giữa
// các lần render, tránh trigger lại useMemo/useEffect phụ thuộc vào nó.
export const EMPTY_CATEGORIES: Category[] = [];
export const EMPTY_MATERIALS: Material[] = [];
export const EMPTY_RECEIPTS: Receipt[] = [];
export const EMPTY_MOVEMENTS: Movement[] = [];
export const EMPTY_WAREHOUSES: Warehouse[] = [];
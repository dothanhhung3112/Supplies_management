import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import { seedData } from "./seed";
import type {
  Category,
  Material,
  Movement,
  Receipt,
  ReceiptLine,
  WarehouseData,
} from "./types";

type MaterialInput = Omit<Material, "id" | "createdAt">;
type CategoryInput = Omit<Category, "id">;
type ReceiptDraft = Omit<Receipt, "id" | "code" | "createdAt" | "postedAt" | "status"> & {
  code?: string;
};

type WarehouseState = WarehouseData & {
  addCategory: (input: CategoryInput) => string;
  updateCategory: (id: string, input: CategoryInput) => void;
  deleteCategory: (id: string) => string | null;
  addMaterial: (input: MaterialInput) => string;
  updateMaterial: (id: string, input: MaterialInput) => void;
  deleteMaterial: (id: string) => string | null;
  saveReceipt: (input: ReceiptDraft, existingId?: string) => string;
  postReceipt: (id: string) => string | null;
  deleteReceipt: (id: string) => string | null;
  adjustStock: (materialId: string, quantity: number, note: string) => string | null;
};

function nextReceiptCode(receipts: Receipt[], date: string) {
  const year = date.slice(0, 4) || String(new Date().getFullYear());
  const prefix = `PN-${year}-`;
  let max = 0;
  for (const r of receipts) {
    if (!r.code.startsWith(prefix)) continue;
    const n = Number(r.code.slice(prefix.length));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

function applyLastPrices(materials: Material[], lines: ReceiptLine[]): Material[] {
  const priceById = new Map(lines.map((l) => [l.materialId, l.unitPrice]));
  return materials.map((m) => {
    const price = priceById.get(m.id);
    return price == null ? m : { ...m, lastUnitPrice: price };
  });
}

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set, get) => ({
      ...seedData,

      addCategory: (input) => {
        const id = uid("cat");
        set((s) => ({ categories: [...s.categories, { id, ...input }] }));
        return id;
      },

      updateCategory: (id, input) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...input } : c)),
        }));
      },

      deleteCategory: (id) => {
        const used = get().materials.some((m) => m.categoryId === id);
        if (used) return "Không thể xóa nhóm đang có vật tư.";
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        return null;
      },

      addMaterial: (input) => {
        const id = uid("mat");
        set((s) => ({
          materials: [
            ...s.materials,
            { ...input, id, createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },

      updateMaterial: (id, input) => {
        set((s) => ({
          materials: s.materials.map((m) => (m.id === id ? { ...m, ...input } : m)),
        }));
      },

      deleteMaterial: (id) => {
        const { receipts, movements } = get();
        if (movements.some((m) => m.materialId === id)) {
          return "Không thể xóa vật tư đã phát sinh tồn kho.";
        }
        if (receipts.some((r) => r.lines.some((l) => l.materialId === id))) {
          return "Không thể xóa vật tư đang nằm trên phiếu nhập.";
        }
        set((s) => ({ materials: s.materials.filter((m) => m.id !== id) }));
        return null;
      },

      saveReceipt: (input, existingId) => {
        const now = new Date().toISOString();
        if (existingId) {
          const current = get().receipts.find((r) => r.id === existingId);
          if (!current) return existingId;
          if (current.status === "posted") return existingId;
          set((s) => ({
            receipts: s.receipts.map((r) =>
              r.id === existingId
                ? {
                    ...r,
                    date: input.date,
                    supplier: input.supplier,
                    warehouse: input.warehouse,
                    note: input.note,
                    lines: input.lines,
                  }
                : r,
            ),
          }));
          return existingId;
        }
        const id = uid("rcpt");
        const code = input.code?.trim() || nextReceiptCode(get().receipts, input.date);
        set((s) => ({
          receipts: [
            {
              id,
              code,
              date: input.date,
              supplier: input.supplier,
              warehouse: input.warehouse,
              note: input.note,
              lines: input.lines,
              status: "draft",
              createdAt: now,
              postedAt: null,
            },
            ...s.receipts,
          ],
        }));
        return id;
      },

      postReceipt: (id) => {
        const receipt = get().receipts.find((r) => r.id === id);
        if (!receipt) return "Không tìm thấy phiếu.";
        if (receipt.status === "posted") return "Phiếu đã ghi sổ.";
        if (!receipt.supplier.trim()) return "Nhập nhà cung cấp trước khi ghi sổ.";
        if (receipt.lines.length === 0) return "Phiếu chưa có dòng vật tư.";
        if (receipt.lines.some((l) => !l.materialId || l.quantity <= 0)) {
          return "Mỗi dòng cần chọn vật tư và số lượng lớn hơn 0.";
        }
        const postedAt = new Date().toISOString();
        const movements: Movement[] = receipt.lines.map((line) => ({
          id: uid("mv"),
          materialId: line.materialId,
          type: "in",
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          receiptId: receipt.id,
          note: `Nhập kho ${receipt.code}`,
          createdAt: postedAt,
        }));
        set((s) => ({
          receipts: s.receipts.map((r) =>
            r.id === id ? { ...r, status: "posted", postedAt } : r,
          ),
          movements: [...s.movements, ...movements],
          materials: applyLastPrices(s.materials, receipt.lines),
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
        set((s) => ({
          movements: [
            ...s.movements,
            {
              id: uid("mv"),
              materialId,
              type: "adjust",
              quantity,
              unitPrice: material.lastUnitPrice,
              receiptId: null,
              note: note.trim(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return null;
      },
    }),
    {
      name: "khovt-warehouse-v1",
      skipHydration: true,
      partialize: (s) => ({
        categories: s.categories,
        materials: s.materials,
        receipts: s.receipts,
        movements: s.movements,
      }),
    },
  ),
);

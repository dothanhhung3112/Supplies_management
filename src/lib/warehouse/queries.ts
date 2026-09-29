import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loadWarehouseData,
  addCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
  addMaterialFn,
  updateMaterialFn,
  deleteMaterialFn,
  saveReceiptFn,
  postReceiptFn,
  deleteReceiptFn,
  adjustStockFn,
  addWarehouseFn,
  updateWarehouseFn,
  deleteWarehouseFn,
} from "./server";
import type { ReceiptLine } from "./types";

export const warehouseKeys = { all: ["warehouse"] as const };

export function useWarehouseData() {
  return useQuery({
    queryKey: warehouseKeys.all,
    queryFn: () => loadWarehouseData(),
  });
}

function useInvalidateWarehouse() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: warehouseKeys.all });
}

// ── Category ──────────────────────────────────────────────────────────────

export function useAddCategory() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (input: { name: string; description: string }) =>
      addCategoryFn({ data: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (vars: { id: string; input: { name: string; description: string } }) =>
      updateCategoryFn({ data: vars }),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryFn({ data: { id } }),
    onSuccess: invalidate,
  });
}

// ── Material ──────────────────────────────────────────────────────────────

type MaterialInput = {
  sku: string;
  name: string;
  categoryId: string;
  unit: string;
  minStock: number;
  location: string;
  note: string;
  lastUnitPrice: number;
};

export function useAddMaterial() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (input: MaterialInput) => addMaterialFn({ data: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateMaterial() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (vars: { id: string; input: MaterialInput }) =>
      updateMaterialFn({ data: vars }),
    onSuccess: invalidate,
  });
}

export function useDeleteMaterial() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (id: string) => deleteMaterialFn({ data: { id } }),
    onSuccess: invalidate,
  });
}

// ── Receipt ───────────────────────────────────────────────────────────────

type ReceiptDraft = {
  date: string;
  supplier: string;
  warehouse: string;
  note: string;
  code?: string;
  lines: ReceiptLine[];
};

export function useSaveReceipt() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (vars: { input: ReceiptDraft; existingId?: string }) =>
      saveReceiptFn({ data: vars }),
    onSuccess: invalidate,
  });
}

export function usePostReceipt() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (id: string) => postReceiptFn({ data: { id } }),
    onSuccess: invalidate,
  });
}

export function useDeleteReceipt() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (id: string) => deleteReceiptFn({ data: { id } }),
    onSuccess: invalidate,
  });
}

// ── Adjust stock ──────────────────────────────────────────────────────────

export function useAdjustStock() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (vars: { materialId: string; quantity: number; note: string }) =>
      adjustStockFn({ data: vars }),
    onSuccess: invalidate,
  });
}

// ── Warehouse ─────────────────────────────────────────────────────────────

export function useAddWarehouse() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (input: { name: string; address: string }) => addWarehouseFn({ data: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateWarehouse() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (vars: { id: string; input: { name: string; address: string } }) =>
      updateWarehouseFn({ data: vars }),
    onSuccess: invalidate,
  });
}

export function useDeleteWarehouse() {
  const invalidate = useInvalidateWarehouse();
  return useMutation({
    mutationFn: (id: string) => deleteWarehouseFn({ data: { id } }),
    onSuccess: invalidate,
  });
}
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, FileSpreadsheet, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddMaterialsFromImport, useWarehouseData } from "@/lib/warehouse/queries";
import { UNITS } from "@/lib/warehouse/constants";
import { readMaterialExcel } from "@/lib/warehouse/excel";
import type { MaterialImportRow } from "@/lib/warehouse/types";

type ImportRow = MaterialImportRow & {
  selected: boolean;
  categoryId: string;
  minStock: string;
  location: string;
  note: string;
  lastUnitPrice: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MaterialExcelImportDialog({ open, onOpenChange }: Props) {
  const { data } = useWarehouseData();
  const categories = data?.categories ?? [];
  const addMaterials = useAddMaterialsFromImport();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"file" | "review">("file");

  useEffect(() => {
    if (!open) {
      setFileName("");
      setRows([]);
      setError("");
      setStep("file");
      if (inputRef.current) inputRef.current.value = "";
      addMaterials.reset();
    }
  }, [open, addMaterials]);

  const existingSkus = useMemo(
    () => new Set((data?.materials ?? []).map((material) => material.sku.trim().toLowerCase())),
    [data?.materials],
  );

  const duplicateSkus = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = row.sku.trim().toLowerCase();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([sku]) => sku));
  }, [rows]);

  const selectedCount = rows.filter((row) => row.selected).length;
  const problemCount = rows.filter((row) => {
    const sku = row.sku.trim().toLowerCase();
    return (
      row.needsReview ||
      existingSkus.has(sku) ||
      duplicateSkus.has(sku) ||
      !row.sku.trim() ||
      !row.name.trim() ||
      !row.categoryId
    );
  }).length;

  function resetFlow() {
    setFileName("");
    setRows([]);
    setError("");
    setStep("file");
    if (inputRef.current) inputRef.current.value = "";
    addMaterials.reset();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setFileName(file.name);

    try {
      const parsed = await readMaterialExcel(file);
      const fallbackCategory = categories[0]?.id ?? "";

      if (!parsed.length) {
        throw new Error("Không tìm thấy dòng vật tư nào trong file.");
      }

      setRows(
        parsed.map((row, index) => {
          const existing = existingSkus.has(row.sku.trim().toLowerCase());
          return {
            ...row,
            unit: row.unit.trim() || "cái",
            existingMaterialId: existing ? row.sku : undefined,
            selected: !existing && !row.needsReview,
            categoryId: fallbackCategory,
            minStock: "0",
            location: "",
            note: "",
            lastUnitPrice: "0",
            warning: existing
              ? "Mã này đã có trong danh mục."
              : row.warning,
          };
        }),
      );
      setStep("review");
    } catch (err) {
      setRows([]);
      setStep("file");
      setError(err instanceof Error ? err.message : "Không thể đọc file Excel.");
    }
  }

  function updateRow(index: number, patch: Partial<ImportRow>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  async function confirmImport() {
    const selected = rows.filter((row) => row.selected);
    if (!selected.length) {
      toast.error("Chọn ít nhất một dòng để thêm vào danh mục.");
      return;
    }

    const invalid = selected.find(
      (row) => !row.sku.trim() || !row.name.trim() || !row.categoryId,
    );
    if (invalid) {
      toast.error("Mỗi dòng được chọn cần có mã, tên và nhóm hàng.");
      return;
    }

    try {
      const result = await addMaterials.mutateAsync(
        selected.map((row) => ({
          sku: row.sku.trim().toUpperCase(),
          name: row.name.trim(),
          unit: row.unit.trim() || "cái",
          categoryId: row.categoryId,
          minStock: Number(row.minStock) || 0,
          location: row.location.trim(),
          note: row.note.trim(),
          lastUnitPrice: Number(row.lastUnitPrice) || 0,
        })),
      );

      if (result.skipped.length) {
        toast.warning(
          result.added
            ? `Đã thêm ${result.added} vật tư; bỏ qua ${result.skipped.length} mã đã tồn tại/trùng.`
            : "Không có vật tư mới được thêm vì các mã đã tồn tại hoặc bị trùng.",
        );
      } else {
        toast.success(`Đã thêm ${result.added} vật tư vào danh mục.`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể thêm vật tư.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={step === "review" ? "max-w-6xl" : "max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>Thêm vật tư từ Excel</DialogTitle>
          <DialogDescription>
            {step === "file"
              ? "Chọn file .xlsx. Hệ thống đọc trực tiếp trên trình duyệt, không cần XAI API hay gửi file lên dịch vụ AI."
              : `${fileName}: đã đọc ${rows.length} dòng. Số lượng chỉ để đối chiếu và không được cộng vào tồn kho.`}
          </DialogDescription>
        </DialogHeader>

        {step === "file" ? (
          <div className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.csv,text/csv"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-52 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 text-center transition hover:bg-secondary"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-card shadow-card">
                <FileSpreadsheet className="size-6" />
              </div>
              <span className="font-medium">Chọn file Excel</span>
              <span className="mt-1 text-sm text-muted-foreground">
                Hỗ trợ .xlsx và .csv, tối đa 10 MB
              </span>
            </button>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Cột nên có:</p>
              <p className="mt-1">
                <strong>Mã hàng</strong> · <strong>Tên hàng</strong> · <strong>ĐVT</strong> ·{" "}
                <strong>Số lượng</strong>
              </p>
              <p className="mt-1">
                Số lượng chỉ được đọc để bạn kiểm tra; hệ thống <strong>không nhập số lượng vào tồn kho</strong>.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={() => inputRef.current?.click()}>
                <Upload className="size-4" />
                Chọn file
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            {problemCount > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50/70 p-3 text-sm dark:bg-amber-950/20">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Có {problemCount} dòng cần kiểm tra</p>
                  <p className="text-muted-foreground">
                    Dòng vàng là mã đã tồn tại, mã bị trùng trong file hoặc thiếu dữ liệu. Bạn có thể sửa, bỏ chọn hoặc xóa dòng.
                  </p>
                </div>
              </div>
            )}

            {!categories.length && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Chưa có nhóm hàng. Hãy tạo ít nhất một nhóm trước khi thêm vật tư từ Excel.
              </div>
            )}

            <div className="max-h-[52vh] overflow-auto rounded-xl border border-border">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="sticky top-0 z-10 bg-card">
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="w-12 px-3 py-3">Chọn</th>
                    <th className="w-32 px-2 py-3">Mã hàng</th>
                    <th className="min-w-[360px] px-2 py-3">Tên hàng</th>
                    <th className="w-24 px-2 py-3">ĐVT</th>
                    <th className="w-24 px-2 py-3">SL tham khảo</th>
                    <th className="w-48 px-2 py-3">Nhóm</th>
                    <th className="w-10 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const sku = row.sku.trim().toLowerCase();
                    const duplicate = Boolean(sku && duplicateSkus.has(sku));
                    const existing = Boolean(sku && existingSkus.has(sku));
                    const problem = row.needsReview || existing || duplicate || !row.sku.trim() || !row.name.trim();

                    return (
                      <tr
                        key={`${row.sku}-${index}`}
                        className={
                          problem
                            ? "border-b border-border bg-amber-50/60 dark:bg-amber-950/10"
                            : "border-b border-border"
                        }
                      >
                        <td className="px-3 py-2 align-top">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(e) => updateRow(index, { selected: e.target.checked })}
                            className="mt-2 size-4 accent-primary"
                            aria-label={`Chọn ${row.sku || `dòng ${index + 1}`}`}
                          />
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Input
                            value={row.sku}
                            onChange={(e) => updateRow(index, { sku: e.target.value })}
                            className="h-9 font-mono text-xs"
                          />
                          {existing && (
                            <p className="mt-1 text-[11px] text-amber-700">Đã có trong danh mục</p>
                          )}
                          {duplicate && !existing && (
                            <p className="mt-1 text-[11px] text-amber-700">Mã trùng trong file</p>
                          )}
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Input
                            value={row.name}
                            onChange={(e) => updateRow(index, { name: e.target.value })}
                            className="h-9"
                          />
                          {row.warning && (
                            <p className="mt-1 flex items-start gap-1 text-[11px] text-amber-700">
                              <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                              {row.warning}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Select value={row.unit} onValueChange={(value) => updateRow(index, { unit: value })}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNITS.includes(row.unit) ? null : (
                                <SelectItem value={row.unit}>{row.unit}</SelectItem>
                              )}
                              {UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-2 align-top">
                          <div className="flex h-9 items-center rounded-md border border-input bg-secondary/40 px-3 tabular-nums text-muted-foreground">
                            {row.quantity}
                          </div>
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Select
                            value={row.categoryId}
                            onValueChange={(value) => updateRow(index, { categoryId: value })}
                            disabled={!categories.length}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Chọn nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeRow(index)}
                            aria-label="Xóa dòng"
                          >
                            <Trash2 className="size-4 text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                Đã chọn <strong className="text-foreground">{selectedCount}</strong> / {rows.length} dòng
              </span>
              <span>Chỉ lưu mã, tên, ĐVT và thông tin danh mục. Không tạo giao dịch tồn kho.</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetFlow} disabled={addMaterials.isPending}>
                Chọn file khác
              </Button>
              <Button
                type="button"
                onClick={() => void confirmImport()}
                disabled={!selectedCount || !categories.length || addMaterials.isPending}
              >
                {addMaterials.isPending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
                {addMaterials.isPending ? "Đang thêm…" : `Thêm ${selectedCount} vật tư`}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

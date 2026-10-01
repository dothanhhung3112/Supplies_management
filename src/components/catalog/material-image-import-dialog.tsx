import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, Loader2, RotateCcw, Trash2, Upload, AlertTriangle } from "lucide-react";
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
import { useAddMaterialsFromImport, useOcrMaterialsFromImages, useWarehouseData } from "@/lib/warehouse/queries";
import { UNITS } from "@/lib/warehouse/constants";
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

async function compressImage(file: File): Promise<string> {
  const source = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Không đọc được ảnh."));
      el.src = source;
    });

    const maxSize = 1600;
    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Không thể xử lý ảnh.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(source);
  }
}

export function MaterialImageImportDialog({ open, onOpenChange }: Props) {
  const { data } = useWarehouseData();
  const categories = data?.categories ?? [];
  const ocr = useOcrMaterialsFromImages();
  const addMaterials = useAddMaterialsFromImport();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"capture" | "review">("capture");

  useEffect(() => {
    if (!open) {
      setImages([]);
      setRows([]);
      setError("");
      setStep("capture");
    }
  }, [open]);

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
  }, [rows, existingSkus]);

  const selectedCount = rows.filter((row) => row.selected).length;
  const problemCount = rows.filter(
    (row) =>
      row.needsReview ||
      existingSkus.has(row.sku.trim().toLowerCase()) ||
      duplicateSkus.has(row.sku.trim().toLowerCase()) ||
      !row.sku.trim() ||
      !row.name.trim() ||
      !row.categoryId,
  ).length;

  function resetFlow() {
    setImages([]);
    setRows([]);
    setError("");
    setStep("capture");
    ocr.reset();
    addMaterials.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const files = [...fileList].slice(0, 4);
    setError("");
    try {
      const compressed = await Promise.all(files.map(compressImage));
      setImages(compressed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xử lý ảnh.");
    }
  }

  async function runOcr() {
    if (!images.length) {
      setError("Chụp hoặc chọn ít nhất một ảnh.");
      return;
    }
    setError("");
    try {
      const result = await ocr.mutateAsync(images);
      const fallbackCategory = categories[0]?.id ?? "";
      setRows(
        result.map((row) => ({
          ...row,
          selected: !row.existingMaterialId && !row.needsReview,
          categoryId: fallbackCategory,
          minStock: "0",
          location: "",
          note: "",
          lastUnitPrice: "0",
        })),
      );
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đọc ảnh.");
    }
  }

  function updateRow(index: number, patch: Partial<ImportRow>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  async function confirmImport() {
    const selected = rows.filter((row) => row.selected);
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
          <DialogTitle>Thêm vật tư từ ảnh</DialogTitle>
          <DialogDescription>
            {step === "capture"
              ? "Chụp hoặc chọn ảnh bảng vật tư. Hệ thống sẽ đọc mã, tên, đơn vị và số lượng để bạn kiểm tra."
              : `Đã nhận diện ${rows.length} dòng. Số lượng chỉ để đối chiếu và không được cộng vào tồn kho.`}
          </DialogDescription>
        </DialogHeader>

        {step === "capture" ? (
          <div className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(e) => void handleFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 text-center transition hover:bg-secondary"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-card shadow-card">
                <Camera className="size-6" />
              </div>
              <span className="font-medium">Chụp ảnh hoặc chọn ảnh</span>
              <span className="mt-1 text-sm text-muted-foreground">
                Có thể chọn tối đa 4 ảnh nếu bảng dài nhiều trang
              </span>
            </button>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div key={image} className="overflow-hidden rounded-lg border border-border bg-secondary">
                    <img src={image} alt={`Ảnh ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                    <p className="px-2 py-1.5 text-xs text-muted-foreground">Ảnh {index + 1}</p>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Mẹo:</strong> chụp thẳng mặt bảng, đủ sáng và để mã hàng nhìn rõ. 
              Hệ thống sẽ không tự tạo vật tư cho đến khi bạn xác nhận ở bước kiểm tra.
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={() => void runOcr()} disabled={!images.length || ocr.isPending}>
                {ocr.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {ocr.isPending ? "Đang đọc ảnh…" : "Đọc ảnh"}
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
                    Dòng vàng là OCR chưa chắc chắn hoặc mã đã tồn tại/trùng. Bạn có thể sửa, bỏ chọn hoặc xóa dòng.
                  </p>
                </div>
              </div>
            )}

            {!categories.length && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Chưa có nhóm hàng. Hãy tạo ít nhất một nhóm trước khi thêm vật tư từ ảnh.
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
                    const duplicate = duplicateSkus.has(row.sku.trim().toLowerCase());
                    const existing = existingSkus.has(row.sku.trim().toLowerCase());
                    const problem = row.needsReview || existing || duplicate;
                    return (
                      <tr
                        key={`${row.sku}-${index}`}
                        className={problem ? "border-b border-border bg-amber-50/60 dark:bg-amber-950/10" : "border-b border-border"}
                      >
                        <td className="px-3 py-2 align-top">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(e) => updateRow(index, { selected: e.target.checked })}
                            className="mt-2 size-4 accent-primary"
                            aria-label={`Chọn ${row.sku}`}
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
                            <p className="mt-1 text-[11px] text-amber-700">Mã trùng trong ảnh</p>
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
                          <Input
                            value={String(row.quantity)}
                            readOnly
                            className="h-9 bg-secondary tabular-nums"
                            title="Chỉ để đối chiếu OCR, không được lưu vào tồn kho"
                          />
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Select
                            value={row.categoryId}
                            onValueChange={(value) => updateRow(index, { categoryId: value })}
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
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-secondary/60 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                Đang chọn <strong>{selectedCount}</strong> / {rows.length} vật tư
              </span>
              <span className="text-muted-foreground">
                Tồn tối thiểu, vị trí và giá đang mặc định 0/trống; có thể sửa sau trong Danh mục.
              </span>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <DialogFooter className="sm:justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetFlow}>
                  <RotateCcw className="size-4" />
                  Chụp lại
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={() => void confirmImport()}
                  disabled={!selectedCount || !categories.length || addMaterials.isPending}
                >
                  {addMaterials.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  {addMaterials.isPending ? "Đang thêm…" : `Thêm ${selectedCount} vật tư`}
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialPicker } from "@/components/material-picker";
import { uid } from "@/lib/utils";
import { formatNumber, formatVnd, todayIsoDate } from "@/lib/warehouse/format";
import { WAREHOUSES } from "@/lib/warehouse/seed";
import { receiptTotal, uniqueSuppliers } from "@/lib/warehouse/selectors";
import { useWarehouseStore } from "@/lib/warehouse/store";
import type { Receipt, ReceiptLine } from "@/lib/warehouse/types";

function emptyLine(): ReceiptLine {
  return { id: uid("ln"), materialId: "", quantity: 1, unitPrice: 0 };
}

export function ReceiptForm({ receipt }: { receipt?: Receipt }) {
  const navigate = useNavigate();
  const categories = useWarehouseStore((s) => s.categories);
  const materials = useWarehouseStore((s) => s.materials);
  const receipts = useWarehouseStore((s) => s.receipts);
  const saveReceipt = useWarehouseStore((s) => s.saveReceipt);
  const postReceipt = useWarehouseStore((s) => s.postReceipt);

  const posted = receipt?.status === "posted";
  const [date, setDate] = useState(receipt?.date ?? todayIsoDate());
  const [supplier, setSupplier] = useState(receipt?.supplier ?? "");
  const [warehouse, setWarehouse] = useState(receipt?.warehouse ?? WAREHOUSES[0]);
  const [note, setNote] = useState(receipt?.note ?? "");
  const [lines, setLines] = useState<ReceiptLine[]>(
    receipt?.lines.length ? receipt.lines : [emptyLine()],
  );

  const suppliers = useMemo(
    () => uniqueSuppliers({ categories, materials, receipts, movements: [] }),
    [categories, materials, receipts],
  );
  const total = receiptTotal(lines);
  const materialById = useMemo(() => new Map(materials.map((m) => [m.id, m])), [materials]);

  function patchLine(id: string, patch: Partial<ReceiptLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function chooseMaterial(lineId: string, materialId: string) {
    const mat = materials.find((m) => m.id === materialId);
    patchLine(lineId, {
      materialId,
      unitPrice: mat?.lastUnitPrice ?? 0,
    });
  }

  function payload() {
    return {
      date,
      supplier: supplier.trim(),
      warehouse,
      note: note.trim(),
      lines: lines.filter((l) => l.materialId),
    };
  }

  function validate() {
    if (!supplier.trim()) {
      toast.error("Nhập nhà cung cấp.");
      return false;
    }
    const complete = lines.filter((l) => l.materialId);
    if (complete.length === 0) {
      toast.error("Thêm ít nhất một dòng vật tư.");
      return false;
    }
    if (complete.some((l) => l.quantity <= 0)) {
      toast.error("Số lượng phải lớn hơn 0.");
      return false;
    }
    return true;
  }

  function onSaveDraft() {
    if (!validate()) return;
    const id = saveReceipt(payload(), receipt?.id);
    toast.success("Đã lưu nháp.");
    if (!receipt) void navigate({ to: "/receipts/$id", params: { id } });
  }

  function onPost() {
    if (!validate()) return;
    const id = saveReceipt(payload(), receipt?.id);
    const err = postReceipt(id);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Đã ghi sổ phiếu nhập. Tồn kho đã được cập nhật.");
    void navigate({ to: "/receipts/$id", params: { id } });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-card p-4 shadow-card sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Ngày nhập</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={posted}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warehouse">Kho nhận</Label>
            <Select value={warehouse} onValueChange={setWarehouse} disabled={posted}>
              <SelectTrigger id="warehouse">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSES.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="supplier">Nhà cung cấp</Label>
            <Input
              id="supplier"
              list="supplier-list"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Tên nhà cung cấp"
              disabled={posted}
            />
            <datalist id="supplier-list">
              {suppliers.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Số hóa đơn, công trình, ghi chú nội bộ…"
              disabled={posted}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Dòng vật tư</h2>
          {posted ? null : (
            <Button type="button" variant="outline" size="sm" onClick={() => setLines((p) => [...p, emptyLine()])}>
              <Plus className="size-4" />
              Thêm dòng
            </Button>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Vật tư</th>
                <th className="w-24 pb-2 pr-3 font-medium">SL</th>
                <th className="w-20 pb-2 pr-3 font-medium">ĐVT</th>
                <th className="w-36 pb-2 pr-3 font-medium">Đơn giá</th>
                <th className="w-36 pb-2 pr-3 text-right font-medium">Thành tiền</th>
                <th className="w-12 pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const mat = materialById.get(line.materialId);
                return (
                  <tr key={line.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3">
                      <MaterialPicker
                        materials={materials}
                        categories={categories}
                        value={line.materialId}
                        onChange={(id) => chooseMaterial(line.id, id)}
                        disabled={posted}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        value={line.quantity}
                        onChange={(e) => patchLine(line.id, { quantity: Number(e.target.value) })}
                        disabled={posted}
                        className="h-11 tabular-nums"
                      />
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{mat?.unit ?? "—"}</td>
                    <td className="py-2 pr-3">
                      <Input
                        type="number"
                        min={0}
                        step="1000"
                        value={line.unitPrice}
                        onChange={(e) => patchLine(line.id, { unitPrice: Number(e.target.value) })}
                        disabled={posted}
                        className="h-11 tabular-nums"
                      />
                    </td>
                    <td className="py-2 pr-3 text-right font-mono tabular-nums">
                      {formatVnd(line.quantity * line.unitPrice)}
                    </td>
                    <td className="py-2">
                      {posted ? null : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Xóa dòng"
                          onClick={() =>
                            setLines((p) => (p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)))
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {lines.map((line, i) => {
            const mat = materialById.get(line.materialId);
            return (
              <div key={line.id} className="rounded-lg bg-secondary/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Dòng {i + 1}</p>
                  {posted ? null : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xóa dòng"
                      onClick={() =>
                        setLines((p) => (p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <MaterialPicker
                    materials={materials}
                    categories={categories}
                    value={line.materialId}
                    onChange={(id) => chooseMaterial(line.id, id)}
                    disabled={posted}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label>Số lượng {mat ? `(${mat.unit})` : ""}</Label>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        value={line.quantity}
                        onChange={(e) => patchLine(line.id, { quantity: Number(e.target.value) })}
                        disabled={posted}
                        className="tabular-nums"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Đơn giá</Label>
                      <Input
                        type="number"
                        min={0}
                        step="1000"
                        value={line.unitPrice}
                        onChange={(e) => patchLine(line.id, { unitPrice: Number(e.target.value) })}
                        disabled={posted}
                        className="tabular-nums"
                      />
                    </div>
                  </div>
                  <p className="text-right text-sm">
                    Thành tiền{" "}
                    <span className="font-mono tabular-nums font-medium">
                      {formatVnd(line.quantity * line.unitPrice)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">{lines.filter((l) => l.materialId).length} dòng</p>
          <p className="text-lg font-semibold tabular-nums">{formatVnd(total)}</p>
        </div>
      </section>

      {posted ? null : (
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            Lưu nháp
          </Button>
          <Button type="button" onClick={onPost}>
            Ghi sổ nhập kho
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReceiptReadOnlyMeta({ receipt }: { receipt: Receipt }) {
  return (
    <p className="text-sm text-muted-foreground">
      Tổng {formatNumber(receipt.lines.length)} dòng · {formatVnd(receiptTotal(receipt.lines))}
    </p>
  );
}

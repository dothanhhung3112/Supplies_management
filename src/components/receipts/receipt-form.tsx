import { useEffect, useMemo, useState } from "react";
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
import { receiptTotal, uniqueSuppliers } from "@/lib/warehouse/selectors";
import { useWarehouseData, useSaveReceipt, usePostReceipt } from "@/lib/warehouse/queries";
import type { Receipt, ReceiptLine } from "@/lib/warehouse/types";
import {
  EMPTY_CATEGORIES,
  EMPTY_MATERIALS,
  EMPTY_RECEIPTS,
  EMPTY_WAREHOUSES,
} from "@/lib/warehouse/empty";

function emptyLine(): ReceiptLine {
  return { id: uid("ln"), materialId: "", quantity: 1, unitPrice: 0 };
}

export function ReceiptForm({ receipt }: { receipt?: Receipt }) {
  const navigate = useNavigate();
  const { data } = useWarehouseData();
  const categories = data?.categories ?? EMPTY_CATEGORIES;
  const materials = data?.materials ?? EMPTY_MATERIALS;
  const receipts = data?.receipts ?? EMPTY_RECEIPTS;
  const warehouses = data?.warehouses ?? EMPTY_WAREHOUSES;

  const saveReceipt = useSaveReceipt();
  const postReceipt = usePostReceipt();

  const posted = receipt?.status === "posted" || receipt?.status === "cancelled";
  const [date, setDate] = useState(receipt?.date ?? todayIsoDate());
  const [supplier, setSupplier] = useState(receipt?.supplier ?? "");
  const [warehouseId, setWarehouseId] = useState(receipt?.warehouseId ?? "");
  const [note, setNote] = useState(receipt?.note ?? "");
  const [lines, setLines] = useState<ReceiptLine[]>(
    receipt?.lines.length ? receipt.lines : [emptyLine()],
  );

  useEffect(() => {
    if (!receipt && !warehouseId && warehouses.length > 0) {
      setWarehouseId(warehouses[0].id);
    }
  }, [warehouses, receipt, warehouseId]);

  const suppliers = useMemo(
    () => uniqueSuppliers({ categories, materials, receipts, movements: [], warehouses }),
    [categories, materials, receipts, warehouses],
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
      warehouseId,
      note: note.trim(),
      lines: lines.filter((l) => l.materialId),
    };
  }

  function validate() {
    if (!warehouseId) {
      toast.error("Chọn kho nhận.");
      return false;
    }
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
    saveReceipt.mutate(
      { input: payload(), existingId: receipt?.id },
      {
        onSuccess: (id) => {
          toast.success("Đã lưu nháp.");
          if (!receipt) void navigate({ to: "/receipts/$id", params: { id } });
        },
        onError: () => toast.error("Lưu nháp thất bại."),
      },
    );
  }

  function onPost() {
    if (!validate()) return;
    saveReceipt.mutate(
      { input: payload(), existingId: receipt?.id },
      {
        onError: (e) => {
          toast.error(e instanceof Error ? e.message : "Lưu phiếu thất bại.");
        },
        onSuccess: (id) => {
          postReceipt.mutate(id, {
            onError: (e) => {
              toast.error(e instanceof Error ? e.message : "Ghi sổ thất bại.");
            },
            onSuccess: (err) => {
              if (err) {
                toast.error(err);
                return;
              }
              toast.success("Đã ghi sổ nhập kho. Tồn kho đã được cập nhật.");
              void navigate({ to: "/receipts/$id", params: { id } });
            },
          });
        },
      },
    );
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
            <Select value={warehouseId} onValueChange={setWarehouseId} disabled={posted}>
              <SelectTrigger id="warehouse">
                <SelectValue placeholder="Chọn kho" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLines((p) => [...p, emptyLine()])}
            >
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
                        onChange={(e) => patchLine(line.id, { quantity: e.target.value === "" ? 0 : Number(e.target.value) })}
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
                            setLines((p) =>
                              p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)
                            )
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
                        setLines((p) =>
                          p.length === 1 ? [emptyLine()] : p.filter((l) => l.id !== line.id)
                        )
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
          <p className="text-sm text-muted-foreground">
            {lines.filter((l) => l.materialId).length} dòng
          </p>
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
      Kho {receipt.warehouse} · Tổng {formatNumber(receipt.lines.length)} dòng · {formatVnd(receipt.totalValue)}
    </p>
  );
}
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatQty } from "@/lib/warehouse/format";
import { useAdjustStock } from "@/lib/warehouse/queries";
import type { Material, Warehouse } from "@/lib/warehouse/types";

export function AdjustDialog({
  open,
  onOpenChange,
  material,
  currentQty,
  warehouses,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  material: Material | null;
  currentQty: number;
  warehouses: Warehouse[];
}) {
  const adjustStock = useAdjustStock();
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [dir, setDir] = useState<"in" | "out">("out");
  const [warehouseId, setWarehouseId] = useState("");

  useEffect(() => {
    if (open) {
      setQty("");
      setNote("");
      setDir("out");
      setWarehouseId(warehouses[0]?.id ?? "");
    }
  }, [open, material, warehouses]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!material) return;
    const n = Number(qty);
    if (!n || n <= 0) {
      toast.error("Nhập số lượng lớn hơn 0.");
      return;
    }
    if (!warehouseId) {
      toast.error("Chọn kho.");
      return;
    }
    const signed = dir === "out" ? -n : n;
    adjustStock.mutate(
      { materialId: material.id, warehouseId, quantity: signed, note },
      {
        onSuccess: (err) => {
          if (err) {
            toast.error(err);
            return;
          }
          toast.success("Đã ghi điều chỉnh tồn kho.");
          onOpenChange(false);
        },
        onError: () => toast.error("Có lỗi khi ghi điều chỉnh."),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Điều chỉnh tồn</DialogTitle>
          <DialogDescription>
            {material
              ? `${material.name} · đang có ${formatQty(currentQty, material.unit)}`
              : "Chọn vật tư"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="space-y-2">
            <Label>Kho</Label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger><SelectValue placeholder="Chọn kho" /></SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={dir === "in" ? "default" : "outline"}
              onClick={() => setDir("in")}
            >
              Tăng tồn
            </Button>
            <Button
              type="button"
              variant={dir === "out" ? "default" : "outline"}
              onClick={() => setDir("out")}
            >
              Giảm tồn
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aqty">Số lượng {material ? `(${material.unit})` : ""}</Label>
            <Input
              id="aqty"
              type="number"
              min={0}
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="tabular-nums"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anote">Lý do</Label>
            <Textarea
              id="anote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Kiểm kê, cấp phát, hao hụt…"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={adjustStock.isPending}>
              Ghi điều chỉnh
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
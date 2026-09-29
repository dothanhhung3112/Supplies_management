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
import { useAddWarehouse, useUpdateWarehouse } from "@/lib/warehouse/queries";
import type { Warehouse } from "@/lib/warehouse/types";

export function WarehouseDialog({ open, onOpenChange, warehouse }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  warehouse?: Warehouse | null;
}) {
  const addWarehouse = useAddWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (open) {
      setName(warehouse?.name ?? "");
      setAddress(warehouse?.address ?? "");
    }
  }, [open, warehouse]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nhập tên kho.");
      return;
    }
    const payload = { name: name.trim(), address: address.trim() };
    if (warehouse) {
      updateWarehouse.mutate(
        { id: warehouse.id, input: payload },
        { onSuccess: () => toast.success("Đã cập nhật kho.") },
      );
    } else {
      addWarehouse.mutate(payload, { onSuccess: () => toast.success("Đã thêm kho.") });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{warehouse ? "Sửa kho" : "Thêm kho"}</DialogTitle>
          <DialogDescription>Kho dùng để chọn nơi nhận hàng khi tạo phiếu nhập.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="whname">Tên kho</Label>
            <Input id="whname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whaddr">Địa chỉ / mô tả</Label>
            <Input id="whaddr" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{warehouse ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
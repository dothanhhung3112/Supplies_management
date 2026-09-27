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
import { Textarea } from "@/components/ui/textarea";
import { useWarehouseStore } from "@/lib/warehouse/store";
import type { Category } from "@/lib/warehouse/types";

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category?: Category | null;
}) {
  const addCategory = useWarehouseStore((s) => s.addCategory);
  const updateCategory = useWarehouseStore((s) => s.updateCategory);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setDescription(category?.description ?? "");
    }
  }, [open, category]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nhập tên nhóm hàng.");
      return;
    }
    const payload = { name: name.trim(), description: description.trim() };
    if (category) {
      updateCategory(category.id, payload);
      toast.success("Đã cập nhật nhóm hàng.");
    } else {
      addCategory(payload);
      toast.success("Đã thêm nhóm hàng.");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Sửa nhóm hàng" : "Thêm nhóm hàng"}</DialogTitle>
          <DialogDescription>Nhóm dùng để lọc danh mục và tồn kho.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="cname">Tên nhóm</Label>
            <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cdesc">Mô tả</Label>
            <Textarea id="cdesc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{category ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

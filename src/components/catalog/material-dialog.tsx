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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNITS } from "@/lib/warehouse/seed";
import { useWarehouseStore } from "@/lib/warehouse/store";
import type { Material } from "@/lib/warehouse/types";

type Form = {
  sku: string;
  name: string;
  categoryId: string;
  unit: string;
  minStock: string;
  location: string;
  note: string;
  lastUnitPrice: string;
};

function fromMaterial(m?: Material, fallbackCategory?: string): Form {
  return {
    sku: m?.sku ?? "",
    name: m?.name ?? "",
    categoryId: m?.categoryId ?? fallbackCategory ?? "",
    unit: m?.unit ?? "cái",
    minStock: m ? String(m.minStock) : "0",
    location: m?.location ?? "",
    note: m?.note ?? "",
    lastUnitPrice: m ? String(m.lastUnitPrice) : "0",
  };
}

export function MaterialDialog({
  open,
  onOpenChange,
  material,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  material?: Material | null;
}) {
  const categories = useWarehouseStore((s) => s.categories);
  const addMaterial = useWarehouseStore((s) => s.addMaterial);
  const updateMaterial = useWarehouseStore((s) => s.updateMaterial);
  const [form, setForm] = useState<Form>(fromMaterial());

  useEffect(() => {
    if (open) setForm(fromMaterial(material ?? undefined, categories[0]?.id));
  }, [open, material, categories]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.sku.trim() || !form.name.trim() || !form.categoryId) {
      toast.error("Nhập mã, tên và nhóm hàng.");
      return;
    }
    const payload = {
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      categoryId: form.categoryId,
      unit: form.unit,
      minStock: Number(form.minStock) || 0,
      location: form.location.trim(),
      note: form.note.trim(),
      lastUnitPrice: Number(form.lastUnitPrice) || 0,
    };
    if (material) {
      updateMaterial(material.id, payload);
      toast.success("Đã cập nhật vật tư.");
    } else {
      addMaterial(payload);
      toast.success("Đã thêm vật tư.");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{material ? "Sửa vật tư" : "Thêm vật tư"}</DialogTitle>
          <DialogDescription>Mã SKU dùng để tìm nhanh trên phiếu nhập và tồn kho.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">Mã SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nhóm hàng</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên vật tư</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Đơn vị</Label>
              <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min">Tồn tối thiểu</Label>
              <Input
                id="min"
                type="number"
                min={0}
                value={form.minStock}
                onChange={(e) => set("minStock", e.target.value)}
                className="tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Đơn giá gần nhất</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="1000"
                value={form.lastUnitPrice}
                onChange={(e) => set("lastUnitPrice", e.target.value)}
                className="tabular-nums"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">Vị trí kho</Label>
            <Input
              id="loc"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Kệ A1, Bãi F2…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" value={form.note} onChange={(e) => set("note", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{material ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

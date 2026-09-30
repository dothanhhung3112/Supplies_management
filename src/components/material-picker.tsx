import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn, norm } from "@/lib/utils";
import type { Category, Material } from "@/lib/warehouse/types";

export function MaterialPicker({
  materials,
  categories,
  value,
  onChange,
  disabled,
}: {
  materials: Material[];
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = materials.find((m) => m.id === value);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    if (!needle) return materials;
    return materials.filter((m) => {
      const hay = norm(`${m.sku} ${m.name} ${catName(m.categoryId)}`);
      return hay.includes(needle);
    });
  }, [materials, q, categories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-11 w-full justify-between font-normal"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? `${selected.sku} — ${selected.name}` : "Chọn vật tư"}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(28rem,calc(100vw-2rem))] p-2" align="start">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm mã, tên vật tư…"
          className="mb-2 h-10"
          autoFocus
        />
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">Không có vật tư khớp.</p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                  setQ("");
                }}
                className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
              >
                <Check
                  className={cn("mt-0.5 size-4 shrink-0", m.id === value ? "opacity-100" : "opacity-0")}
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{m.name}</span>
                  <span className="block font-mono text-xs text-muted-foreground">
                    {m.sku} · {catName(m.categoryId)} · {m.unit}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

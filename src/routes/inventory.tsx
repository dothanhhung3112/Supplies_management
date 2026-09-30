import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { AdjustDialog } from "@/components/inventory/adjust-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StockBadge } from "@/components/stock-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber, formatQty, formatVnd } from "@/lib/warehouse/format";
import { stockMap, stockStatus, type StockStatus } from "@/lib/warehouse/selectors";
import { useWarehouseData } from "@/lib/warehouse/queries";
import { norm } from "@/lib/utils";
import { EMPTY_CATEGORIES, EMPTY_MATERIALS } from "@/lib/warehouse/empty";
import type { Material } from "@/lib/warehouse/types";

export const Route = createFileRoute("/inventory")({ component: InventoryPage });

function InventoryPage() {
  const { data } = useWarehouseData();
  const categories = data?.categories ?? EMPTY_CATEGORIES;
  const materials = data?.materials ?? EMPTY_MATERIALS;
  const stocks = useMemo(() => stockMap(data?.stocks ?? []), [data?.stocks]);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [status, setStatus] = useState<"all" | StockStatus>("all");
  const [adjusting, setAdjusting] = useState<Material | null>(null);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    const needle = norm(q.trim());
    return materials
      .map((m) => {
        const qty = stocks.get(m.id) ?? 0;
        return { material: m, qty, status: stockStatus(qty, m.minStock), value: qty * m.lastUnitPrice };
      })
      .filter((row) => {
        if (catFilter !== "all" && row.material.categoryId !== catFilter) return false;
        if (status !== "all" && row.status !== status) return false;
        if (!needle) return true;
        return norm(`${row.material.sku} ${row.material.name} ${row.material.location}`).includes(needle);
      })
      .sort((a, b) => a.qty - b.qty);
  }, [materials, stocks, q, catFilter, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kho"
        title="Tồn kho"
        description="Số lượng hiện có theo từng mã, cảnh báo dưới định mức và điều chỉnh kiểm kê."
      />

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên, vị trí…" className="pl-9" />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="h-11 rounded-md border border-input bg-card px-3 text-sm"
        >
          <option value="all">Tất cả nhóm</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(
            [
              ["all", "Tất cả"],
              ["out", "Hết"],
              ["low", "Sắp hết"],
              ["ok", "Đủ"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={
                status === key
                  ? "h-9 rounded-md bg-card px-3 text-sm font-medium shadow-card"
                  : "h-9 rounded-md px-3 text-sm text-muted-foreground"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title="Không có mã khớp"
          description="Đổi bộ lọc hoặc từ khóa tìm kiếm."
        />
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {rows.map((row) => (
              <article key={row.material.id} className="rounded-xl bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{row.material.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{row.material.sku}</p>
                  </div>
                  <StockBadge qty={row.qty} minStock={row.material.minStock} />
                </div>
                <p className="mt-3 text-xl font-semibold tabular-nums">
                  {formatQty(row.qty, row.material.unit)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Min {formatNumber(row.material.minStock)} · {formatVnd(row.value)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setAdjusting(row.material)}
                >
                  <SlidersHorizontal className="size-4" />
                  Điều chỉnh
                </Button>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl bg-card shadow-card md:block">
            <table className="w-full min-w-[56rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-3 py-3 font-medium">Tên</th>
                  <th className="px-3 py-3 font-medium">Nhóm</th>
                  <th className="px-3 py-3 font-medium">Tồn</th>
                  <th className="px-3 py-3 font-medium">Min</th>
                  <th className="px-3 py-3 font-medium">Trạng thái</th>
                  <th className="px-3 py-3 font-medium">Giá trị</th>
                  <th className="px-3 py-3 font-medium">Vị trí</th>
                  <th className="px-3 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.material.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-5 py-3 font-mono text-xs">{row.material.sku}</td>
                    <td className="px-3 py-3 font-medium">{row.material.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{catName(row.material.categoryId)}</td>
                    <td className="px-3 py-3 font-mono tabular-nums">
                      {formatQty(row.qty, row.material.unit)}
                    </td>
                    <td className="px-3 py-3 tabular-nums">{formatNumber(row.material.minStock)}</td>
                    <td className="px-3 py-3">
                      <StockBadge qty={row.qty} minStock={row.material.minStock} />
                    </td>
                    <td className="px-3 py-3 font-mono tabular-nums">{formatVnd(row.value)}</td>
                    <td className="px-3 py-3">{row.material.location || "—"}</td>
                    <td className="px-3 py-3">
                      <Button variant="outline" size="sm" onClick={() => setAdjusting(row.material)}>
                        Điều chỉnh
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AdjustDialog
        open={!!adjusting}
        onOpenChange={(v) => !v && setAdjusting(null)}
        material={adjusting}
        currentQty={adjusting ? (stocks.get(adjusting.id) ?? 0) : 0}
      />
    </div>
  );
}
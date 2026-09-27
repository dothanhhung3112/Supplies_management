import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDateTime, formatQty, formatVnd } from "@/lib/warehouse/format";
import { useWarehouseData } from "@/lib/warehouse/queries";
import type { MovementType } from "@/lib/warehouse/types";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const { data } = useWarehouseData();
  const materials = data?.materials ?? [];
  const receipts = data?.receipts ?? [];
  const movements = data?.movements ?? [];
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | MovementType>("all");

  const materialById = useMemo(() => new Map(materials.map((m) => [m.id, m])), [materials]);
  const receiptById = useMemo(() => new Map(receipts.map((r) => [r.id, r])), [receipts]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...movements]
      .filter((m) => (type === "all" ? true : m.type === type))
      .filter((m) => {
        if (!needle) return true;
        const mat = materialById.get(m.materialId);
        const rcpt = m.receiptId ? receiptById.get(m.receiptId) : null;
        return `${mat?.sku ?? ""} ${mat?.name ?? ""} ${m.note} ${rcpt?.code ?? ""} ${rcpt?.supplier ?? ""}`
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [movements, type, q, materialById, receiptById]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhật ký"
        title="Lịch sử kho"
        description="Mọi lần nhập kho và điều chỉnh tồn, mới nhất ở trên."
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm vật tư, số phiếu, lý do…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(
            [
              ["all", "Tất cả"],
              ["in", "Nhập kho"],
              ["adjust", "Điều chỉnh"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={
                type === key
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
          title="Chưa có phát sinh"
          description="Ghi sổ phiếu nhập hoặc điều chỉnh tồn để thấy lịch sử."
        />
      ) : (
        <ol className="space-y-2">
          {rows.map((m) => {
            const mat = materialById.get(m.materialId);
            const rcpt = m.receiptId ? receiptById.get(m.receiptId) : null;
            const inbound = m.type === "in";
            return (
              <li key={m.id} className="rounded-xl bg-card p-4 shadow-card sm:px-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={inbound ? "success" : "secondary"}>
                        {inbound ? "Nhập kho" : "Điều chỉnh"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</span>
                    </div>
                    <p className="mt-2 font-medium">{mat?.name ?? "Vật tư đã xóa"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{mat?.sku}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
                    {rcpt ? (
                      <Link
                        to="/receipts/$id"
                        params={{ id: rcpt.id }}
                        className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                      >
                        {rcpt.code} · {rcpt.supplier}
                      </Link>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className={`font-mono text-lg font-semibold tabular-nums ${m.quantity < 0 ? "text-destructive" : "text-success"}`}>
                      {m.quantity > 0 ? "+" : ""}
                      {formatQty(m.quantity, mat?.unit)}
                    </p>
                    {inbound ? (
                      <p className="font-mono text-xs text-muted-foreground tabular-nums">
                        {formatVnd(m.quantity * m.unitPrice)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime, formatQty, formatVnd } from "@/lib/warehouse/format";
import { useWarehouseHistory } from "@/lib/warehouse/queries";
import { norm } from "@/lib/utils";
import type { MovementType } from "@/lib/warehouse/types";

export const Route = createFileRoute("/history")({ component: HistoryPage });

const PAGE_SIZE = 50;

function HistoryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | MovementType>("all");
  const [page, setPage] = useState(0);
  const { data, isFetching } = useWarehouseHistory({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    q: norm(q.trim()),
    type,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhật ký"
        title="Lịch sử kho"
        description="Lịch sử được tải theo từng trang để không phải kéo toàn bộ movements về trình duyệt."
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
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
              ["reverse", "Hoàn tác"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setType(key);
                setPage(0);
              }}
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
        <>
          <ol className={isFetching ? "space-y-2 opacity-70" : "space-y-2"}>
            {rows.map((m) => {
              const inbound = m.type === "in";
              const reversed = m.type === "reverse";
              return (
                <li key={m.id} className="rounded-xl bg-card p-4 shadow-card sm:px-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={inbound ? "success" : reversed ? "destructive" : "secondary"}>
                          {inbound ? "Nhập kho" : reversed ? "Hoàn tác" : "Điều chỉnh"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</span>
                      </div>
                      <p className="mt-2 font-medium">{m.materialName ?? "Vật tư đã xóa"}</p>
                      <p className="text-xs text-muted-foreground">Kho: {m.warehouseName ?? "—"}</p>
                      <p className="font-mono text-xs text-muted-foreground">{m.materialSku ?? "—"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
                      {m.receiptId && m.receiptCode ? (
                        <Link
                          to="/receipts/$id"
                          params={{ id: m.receiptId }}
                          className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                        >
                          {m.receiptCode} · {m.receiptSupplier ?? ""}
                        </Link>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className={`font-mono text-lg font-semibold tabular-nums ${m.quantity < 0 ? "text-destructive" : "text-success"}`}>
                        {m.quantity > 0 ? "+" : ""}
                        {formatQty(m.quantity, m.materialUnit ?? undefined)}
                      </p>
                      {inbound || reversed ? (
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

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} / {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0 || isFetching} onClick={() => setPage((p) => p - 1)}>
                Trước
              </Button>
              <Button variant="outline" size="sm" disabled={page + 1 >= pageCount || isFetching} onClick={() => setPage((p) => p + 1)}>
                Sau
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

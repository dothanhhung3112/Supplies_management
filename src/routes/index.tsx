import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { format } from "date-fns";
import { AlertTriangle, ArrowRight, Boxes, ClipboardList, PackagePlus, Warehouse } from "lucide-react";
const InboundChart = lazy(() => import("@/components/dashboard/inbound-chart").then((m) => ({ default: m.InboundChart })));
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StockBadge } from "@/components/stock-badge";
import { formatNumber, formatVnd } from "@/lib/warehouse/format";
import {
  inboundByMonth,
  inventoryValue,
  lowStockMaterials,
} from "@/lib/warehouse/selectors";
import { useWarehouseData } from "@/lib/warehouse/queries";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { data } = useWarehouseData();
  const categories = data?.categories ?? [];
  const materials = data?.materials ?? [];
  const receipts = data?.receipts ?? [];
  const warehouseData = data ?? { categories, materials, receipts, movements: [], warehouses: [], stocks: [], inboundByMonth: [] };
  const low = lowStockMaterials(warehouseData);
  const value = inventoryValue(materials, data?.stocks ?? []);
  const thisMonth = format(new Date(), "yyyy-MM");
  const postedThisMonth = receipts.filter((r) => r.status === "posted" && r.date.startsWith(thisMonth));
  const drafts = receipts.filter((r) => r.status === "draft");
  const chart = inboundByMonth(warehouseData, 6);
  const recent = [...receipts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kho vật tư"
        title="Tổng quan nhập kho"
        description="Theo dõi danh mục, tồn kho và phiếu nhập trên một màn hình."
        actions={
          <Button asChild>
            <Link to="/receipts/new">
              <PackagePlus className="size-4" />
              Tạo phiếu nhập
            </Link>
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Boxes className="size-4" />}
          label="Mã vật tư"
          value={formatNumber(materials.length)}
          hint={`${categories.length} nhóm hàng`}
        />
        <Stat
          icon={<Warehouse className="size-4" />}
          label="Giá trị tồn"
          value={formatVnd(value)}
          hint="Theo đơn giá nhập gần nhất"
        />
        <Stat
          icon={<AlertTriangle className="size-4" />}
          label="Cảnh báo tồn"
          value={formatNumber(low.length)}
          hint="Hết hàng hoặc dưới mức tối thiểu"
          tone={low.length ? "warn" : "ok"}
        />
        <Stat
          icon={<ClipboardList className="size-4" />}
          label="Phiếu tháng này"
          value={formatNumber(postedThisMonth.length)}
          hint={drafts.length ? `${drafts.length} phiếu nháp` : "Không có nháp"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Nhập kho 6 tháng</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Suspense fallback={<div className="h-full animate-pulse rounded-lg bg-secondary" />}>
              <InboundChart data={chart} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Tồn thấp</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/inventory">
                Xem kho
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {low.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Không có mã nào dưới định mức.</p>
            ) : (
              <ul className="divide-y divide-border">
                {low.slice(0, 6).map((row) => (
                  <li key={row.material.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.material.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{row.material.sku}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-sm tabular-nums">
                        {formatNumber(row.qty)}/{formatNumber(row.material.minStock)}
                      </span>
                      <StockBadge qty={row.qty} minStock={row.material.minStock} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Phiếu gần đây</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/receipts">
              Tất cả phiếu
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  to="/receipts/$id"
                  params={{ id: r.id }}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-secondary/60"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium">{r.code}</p>
                    <p className="truncate text-sm text-muted-foreground">{r.supplier}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-sm tabular-nums">{formatVnd(r.totalValue)}</span>
                    <Badge variant={r.status === "posted" ? "success" : "secondary"}>
                      {r.status === "posted" ? "Đã ghi sổ" : "Nháp"}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  tone?: "warn" | "ok";
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span
            className={
              tone === "warn" ? "text-warning" : tone === "ok" ? "text-success" : "text-muted-foreground"
            }
          >
            {icon}
          </span>
        </div>
        <p className="text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

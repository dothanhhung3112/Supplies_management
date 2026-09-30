import { EMPTY_RECEIPTS } from "@/lib/warehouse/empty";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PackagePlus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, formatVnd } from "@/lib/warehouse/format";
import { useWarehouseData, useDeleteReceipt } from "@/lib/warehouse/queries";
import type { Receipt } from "@/lib/warehouse/types";
import { norm } from "@/lib/utils";

export const Route = createFileRoute("/receipts/")({ component: ReceiptsPage });

function ReceiptsPage() {
  const { data } = useWarehouseData();
   const receipts = data?.receipts ?? EMPTY_RECEIPTS;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "posted" | "cancelled">("all");
  const deleteReceipt = useDeleteReceipt();
  const [deleting, setDeleting] = useState<Receipt | null>(null);

  const rows = useMemo(() => {
    const needle = norm(q.trim());
    return [...receipts]
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => {
        if (!needle) return true;
        return norm(`${r.code} ${r.supplier} ${r.warehouse} ${r.note}`).includes(needle);
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [receipts, q, status]);

  function confirmDelete() {
    if (!deleting) return;
    deleteReceipt.mutate(deleting.id, {
      onSuccess: (err) => {
        if (err) toast.error(err);
        else toast.success(deleting.status === "posted" ? "Đã hủy phiếu và giữ lịch sử." : "Đã xóa phiếu.");
        setDeleting(null);
      },
      onError: () => {
        toast.error("Xóa phiếu thất bại.");
        setDeleting(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhập kho"
        title="Phiếu nhập kho"
        description="Tạo phiếu, lưu nháp rồi ghi sổ để cộng tồn. Xóa phiếu đã ghi sổ sẽ hoàn tác tồn kho liên quan."
        actions={
          <Button asChild>
            <Link to="/receipts/new">
              <PackagePlus className="size-4" />
              Tạo phiếu nhập
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm số phiếu, nhà cung cấp…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(
            [
              ["all", "Tất cả"],
              ["draft", "Nháp"],
              ["posted", "Đã ghi sổ"],
              ["cancelled", "Đã hủy"],
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
          icon={<PackagePlus className="size-5" />}
          title="Chưa có phiếu"
          description="Tạo phiếu nhập để ghi nhận hàng vào kho."
          action={
            <Button asChild>
              <Link to="/receipts/new">Tạo phiếu nhập</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {rows.map((r) => (
              <article key={r.id} className="rounded-xl bg-card p-4 shadow-card">
                <Link to="/receipts/$id" params={{ id: r.id }} className="block">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono font-medium">{r.code}</p>
                    <Badge variant={r.status === "posted" ? "success" : r.status === "cancelled" ? "destructive" : "secondary"}>
                      {r.status === "posted" ? "Đã ghi sổ" : r.status === "cancelled" ? "Đã hủy" : "Nháp"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm">{r.supplier}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(r.date)} · {r.warehouse}
                  </p>
                  <p className="mt-1 font-mono text-sm tabular-nums">{formatVnd(r.totalValue)}</p>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 text-destructive" disabled={r.status === "cancelled"}
                  onClick={() => setDeleting(r)}
                >
                  <Trash2 className="size-4" />
                  {r.status === "posted" ? "Hủy phiếu" : r.status === "cancelled" ? "Đã hủy" : "Xóa nháp"}
                </Button>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl bg-card shadow-card md:block">
            <table className="w-full min-w-[56rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Số phiếu</th>
                  <th className="px-3 py-3 font-medium">Ngày</th>
                  <th className="px-3 py-3 font-medium">Nhà cung cấp</th>
                  <th className="px-3 py-3 font-medium">Kho</th>
                  <th className="px-3 py-3 font-medium">Trạng thái</th>
                  <th className="px-3 py-3 text-right font-medium">Giá trị</th>
                  <th className="w-12 px-3 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-5 py-3">
                      <Link to="/receipts/$id" params={{ id: r.id }} className="font-mono font-medium hover:underline">
                        {r.code}
                      </Link>
                    </td>
                    <td className="px-3 py-3 tabular-nums">{formatDate(r.date)}</td>
                    <td className="px-3 py-3">{r.supplier}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.warehouse}</td>
                    <td className="px-3 py-3">
                      <Badge variant={r.status === "posted" ? "success" : r.status === "cancelled" ? "destructive" : "secondary"}>
                        {r.status === "posted" ? "Đã ghi sổ" : r.status === "cancelled" ? "Đã hủy" : "Nháp"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">
                      {formatVnd(r.totalValue)}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Xóa phiếu"
                        onClick={() => setDeleting(r)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phiếu nhập?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? deleting.status === "posted"
                  ? `Phiếu ${deleting.code} đã ghi sổ — hệ thống sẽ hủy phiếu và tạo bút toán đảo để giữ nguyên lịch sử.`
                  : deleting.status === "cancelled"
                    ? `Phiếu ${deleting.code} đã được hủy và không thể thao tác lại.`
                    : `Phiếu ${deleting.code} sẽ bị xóa. Thao tác này không hoàn tác được.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ReceiptForm, ReceiptReadOnlyMeta } from "@/components/receipts/receipt-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDateTime } from "@/lib/warehouse/format";
import { useReceipt, useDeleteReceipt, useWarehouseData } from "@/lib/warehouse/queries";

export const Route = createFileRoute("/receipts/$id")({ component: ReceiptDetailPage });

function ReceiptDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: receipt, isPending } = useReceipt(id);
  const { data: warehouseData } = useWarehouseData();
  const deleteReceipt = useDeleteReceipt();
  const [exporting, setExporting] = useState(false);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Đang tải phiếu…</p>;
  }

  if (!receipt) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Không tìm thấy phiếu này.</p>
        <Button asChild variant="outline">
          <Link to="/receipts">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const current = receipt;

  async function onExport() {
    setExporting(true);
    try {
      const { exportReceiptDocx } = await import("@/lib/warehouse/export-receipt-docx");
      await exportReceiptDocx(current, warehouseData?.materials ?? [], warehouseData?.warehouses ?? []);
    } catch {
      toast.error("Xuất file Word thất bại.");
    } finally {
      setExporting(false);
    }
  }

  function onDelete() {
    deleteReceipt.mutate(current.id, {
      onSuccess: (err) => {
        if (err) {
          toast.error(err);
          return;
        }
        toast.success("Đã xóa phiếu.");
        void navigate({ to: "/receipts" });
      },
      onError: () => toast.error("Xóa phiếu thất bại."),
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/receipts">
          <ArrowLeft className="size-4" />
          Phiếu nhập
        </Link>
      </Button>

      <PageHeader
        eyebrow={receipt.code}
        title={receipt.status === "posted" ? "Phiếu đã ghi sổ" : "Phiếu nháp"}
        description={
          receipt.status === "posted" && receipt.postedAt
            ? `Ghi sổ lúc ${formatDateTime(receipt.postedAt)} · ${receipt.warehouse}`
            : `${receipt.warehouse}. Chỉnh sửa rồi ghi sổ để cộng tồn.`
        }
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={receipt.status === "posted" ? "success" : "secondary"}>
              {receipt.status === "posted" ? "Đã ghi sổ" : "Nháp"}
            </Badge>

            <Button variant="outline" onClick={onExport} disabled={exporting}>
              <FileDown className="size-4" />
              {exporting ? "Đang xuất…" : "Xuất Word"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Trash2 className="size-4" />
                  {receipt.status === "posted" ? "Xóa phiếu" : "Xóa nháp"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa phiếu nhập?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {receipt.status === "posted"
                      ? `Phiếu ${receipt.code} đã ghi sổ — xóa sẽ hoàn tác tồn kho liên quan đến phiếu này. Thao tác này không hoàn tác được.`
                      : `Phiếu ${receipt.code} sẽ bị xóa. Thao tác này không hoàn tác được.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Xóa</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <ReceiptReadOnlyMeta receipt={receipt} />
      <ReceiptForm receipt={receipt} />
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ReceiptForm } from "@/components/receipts/receipt-form";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/receipts/new")({ component: NewReceiptPage });

function NewReceiptPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/receipts">
          <ArrowLeft className="size-4" />
          Phiếu nhập
        </Link>
      </Button>
      <PageHeader
        eyebrow="Nhập kho"
        title="Tạo phiếu nhập"
        description="Chọn vật tư, số lượng và đơn giá. Lưu nháp hoặc ghi sổ để cộng tồn ngay."
      />
      <ReceiptForm />
    </div>
  );
}

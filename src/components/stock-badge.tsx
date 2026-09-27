import { Badge } from "@/components/ui/badge";
import { stockStatus, stockStatusLabel, type StockStatus } from "@/lib/warehouse/selectors";

export function StockBadge({ qty, minStock }: { qty: number; minStock: number }) {
  const status: StockStatus = stockStatus(qty, minStock);
  const variant = status === "ok" ? "success" : status === "low" ? "warning" : "danger";
  return <Badge variant={variant}>{stockStatusLabel(status)}</Badge>;
}

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Boxes, ClipboardList, History, LayoutDashboard, Package, Search, Warehouse } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWarehouseData } from "@/lib/warehouse/queries";
import { formatDate } from "@/lib/warehouse/format";
import { SearchContext, useSearchOpen } from "@/lib/search-context";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <SearchContext.Provider value={{ open, setOpen }}>{children}</SearchContext.Provider>;
}

const PAGES = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/catalog", label: "Danh mục vật tư", icon: Boxes },
  { to: "/inventory", label: "Tồn kho", icon: Warehouse },
  { to: "/receipts", label: "Phiếu nhập kho", icon: ClipboardList },
  { to: "/receipts/new", label: "Tạo phiếu nhập", icon: ClipboardList },
  { to: "/history", label: "Lịch sử", icon: History },
];

export function SearchCommand() {
  const { open, setOpen } = useSearchOpen();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { data } = useWarehouseData();

  const materials = useMemo(() => data?.materials ?? [], [data?.materials]);
  const receipts = useMemo(() => data?.receipts ?? [], [data?.receipts]);

  const needle = q.trim().toLowerCase();

  const pageHits = useMemo(
    () => PAGES.filter((p) => !needle || p.label.toLowerCase().includes(needle)),
    [needle],
  );
  const materialHits = useMemo(() => {
    if (!needle) return materials.slice(0, 6);
    return materials
      .filter((m) => `${m.sku} ${m.name}`.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [materials, needle]);
  const receiptHits = useMemo(() => {
    if (!needle) return receipts.slice(0, 5);
    return receipts
      .filter((r) => `${r.code} ${r.supplier} ${r.note}`.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [receipts, needle]);

  function go(to: string) {
    setOpen(false);
    setQ("");
    void navigate({ to });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQ("");
      }}
    >
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogTitle className="sr-only">Tìm kiếm</DialogTitle>
        <DialogDescription className="sr-only">Tìm vật tư, phiếu nhập và trang</DialogDescription>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm vật tư, phiếu nhập, trang…"
            className="h-12 border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          <Section title="Trang">
            {pageHits.map((p) => (
              <Row key={p.to} icon={<p.icon className="size-4" />} onClick={() => go(p.to)}>
                {p.label}
              </Row>
            ))}
          </Section>
          <Section title="Vật tư">
            {materialHits.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">Không có vật tư.</p>
            ) : (
              materialHits.map((m) => (
                <Row
                  key={m.id}
                  icon={<Package className="size-4" />}
                  hint={m.sku}
                  onClick={() => go("/inventory")}
                >
                  {m.name}
                </Row>
              ))
            )}
          </Section>
          <Section title="Phiếu nhập">
            {receiptHits.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">Không có phiếu.</p>
            ) : (
              receiptHits.map((r) => (
                <Row
                  key={r.id}
                  icon={<ClipboardList className="size-4" />}
                  hint={`${formatDate(r.date)} · ${r.supplier}`}
                  onClick={() => go(`/receipts/${r.id}`)}
                >
                  {r.code}
                </Row>
              ))
            )}
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({
  icon,
  hint,
  children,
  onClick,
}: {
  icon: ReactNode;
  hint?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint ? <span className="shrink-0 font-mono text-xs text-muted-foreground">{hint}</span> : null}
    </button>
  );
}
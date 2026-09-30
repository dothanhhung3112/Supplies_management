import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  ClipboardList,
  History,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Search,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useWarehouseData } from "@/lib/warehouse/queries";
import { SearchCommand } from "@/components/search-command";
import { useSearchOpen } from "@/lib/search-context";

const NAV = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/catalog", label: "Danh mục", icon: Boxes },
  { to: "/inventory", label: "Tồn kho", icon: Warehouse },
  { to: "/receipts", label: "Phiếu nhập", icon: ClipboardList },
  { to: "/history", label: "Lịch sử", icon: History },
] as const;

function pathActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary-foreground/10 text-sidebar-foreground">
        <Warehouse className="size-5" />
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className="block text-sm font-semibold tracking-tight">KhoVT</span>
          <span className="block text-xs text-sidebar-muted">Nhập kho vật tư</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({
  pathname,
  onNavigate,
  variant,
}: {
  pathname: string;
  onNavigate?: () => void;
  variant: "sidebar" | "mobile-sheet";
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathActive(pathname, item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
              variant === "sidebar" &&
                (active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"),
              variant === "mobile-sheet" &&
                (active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"),
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center px-4">
        <Brand />
      </div>
      <div className="flex-1 px-3 py-2">
        <NavLinks pathname={pathname} variant="sidebar" />
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs leading-relaxed text-sidebar-muted">
          Sổ kho nội bộ. Dữ liệu được lưu trên cơ sở dữ liệu.
        </p>
      </div>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-5">
        {NAV.map((item) => {
          const active = pathActive(pathname, item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh bg-background">
      <div className="hidden w-60 bg-sidebar lg:block" />
      <div className="flex-1 p-6">
        <div className="h-8 w-48 rounded-md bg-secondary" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card shadow-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShellError({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-destructive/10 p-2 text-destructive">
            <Warehouse className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold">Không tải được dữ liệu kho</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Máy chủ không trả về dữ liệu. Bạn có thể thử tải lại mà không cần mở lại trang.
            </p>
            <p className="mt-3 break-words rounded-md bg-secondary p-3 font-mono text-xs text-muted-foreground">
              {message}
            </p>
            <Button className="mt-4" onClick={onRetry} disabled={retrying}>
              {retrying ? "Đang thử lại…" : "Thử lại"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen: setSearchOpen } = useSearchOpen();
  const { isPending, isError, error, refetch, isFetching } = useWarehouseData();

  if (isPending) {
    return (
      <>
        <ShellSkeleton />
        <Toaster />
      </>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <>
        <ShellError message={message} onRetry={() => void refetch()} retrying={isFetching} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="size-5" />
          </Button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-sm text-muted-foreground shadow-card transition-[box-shadow] duration-150 hover:shadow-card-hover lg:max-w-md"
          >
            <Search className="size-4 shrink-0" />
            <span className="truncate">Tìm vật tư, phiếu nhập…</span>
            <kbd className="ml-auto hidden rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/receipts/new">
              <PackagePlus className="size-4" />
              Tạo phiếu nhập
            </Link>
          </Button>
          <Button asChild size="icon" className="sm:hidden" aria-label="Tạo phiếu nhập">
            <Link to="/receipts/new">
              <PackagePlus className="size-4" />
            </Link>
          </Button>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav pathname={pathname} />
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="flex flex-col bg-sidebar p-0 text-sidebar-foreground">
          <div className="flex h-16 items-center px-4 pr-12">
            <Brand />
          </div>
          <div className="px-3">
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} variant="mobile-sheet" />
          </div>
        </SheetContent>
      </Sheet>
      <SearchCommand />
      <Toaster />
    </div>
  );
}

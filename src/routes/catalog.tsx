import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryDialog } from "@/components/catalog/category-dialog";
import { MaterialDialog } from "@/components/catalog/material-dialog";
import { WarehouseDialog } from "@/components/catalog/warehouse-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  useWarehouseData,
  useDeleteMaterial,
  useDeleteCategory,
  useDeleteWarehouse,
} from "@/lib/warehouse/queries";
import { formatNumber, formatVnd } from "@/lib/warehouse/format";
import type { Category, Material, Warehouse } from "@/lib/warehouse/types";
import { EMPTY_CATEGORIES, EMPTY_MATERIALS } from "@/lib/warehouse/empty";

export const Route = createFileRoute("/catalog")({ component: CatalogPage });

function CatalogPage() {
  const [tab, setTab] = useState<"materials" | "categories" | "warehouses">("materials");
  const { data } = useWarehouseData();
  const categories = data?.categories ?? EMPTY_CATEGORIES;
  const materials = data?.materials ?? EMPTY_MATERIALS;
  const warehouses = data?.warehouses ?? [];

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const [matOpen, setMatOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [whOpen, setWhOpen] = useState(false);

  const [editingMat, setEditingMat] = useState<Material | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);

  const [deletingMat, setDeletingMat] = useState<Material | null>(null);
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [deletingWh, setDeletingWh] = useState<Warehouse | null>(null);

  const deleteMaterial = useDeleteMaterial();
  const deleteCategory = useDeleteCategory();
  const deleteWarehouse = useDeleteWarehouse();

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return materials.filter((m) => {
      if (catFilter !== "all" && m.categoryId !== catFilter) return false;
      if (!needle) return true;
      return `${m.sku} ${m.name} ${m.location} ${catName(m.categoryId)}`
        .toLowerCase()
        .includes(needle);
    });
  }, [materials, q, catFilter, categories]);

  function confirmDeleteMat() {
    if (!deletingMat) return;
    deleteMaterial.mutate(deletingMat.id, {
      onSuccess: (err) => {
        if (err) toast.error(err);
        else toast.success("Đã xóa vật tư.");
        setDeletingMat(null);
      },
    });
  }

  function confirmDeleteCat() {
    if (!deletingCat) return;
    deleteCategory.mutate(deletingCat.id, {
      onSuccess: (err) => {
        if (err) toast.error(err);
        else toast.success("Đã xóa nhóm hàng.");
        setDeletingCat(null);
      },
    });
  }

  function confirmDeleteWh() {
    if (!deletingWh) return;
    deleteWarehouse.mutate(deletingWh.id, {
      onSuccess: (err) => {
        if (err) toast.error(err);
        else toast.success("Đã xóa kho.");
        setDeletingWh(null);
      },
      onError: () => {
        toast.error("Xóa kho thất bại.");
        setDeletingWh(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Danh mục"
        title="Vật tư & nhóm hàng"
        description="Quản lý mã SKU, đơn vị tính, định mức tồn và vị trí kệ."
        actions={
          tab === "materials" ? (
            <Button
              onClick={() => {
                setEditingMat(null);
                setMatOpen(true);
              }}
            >
              <Plus className="size-4" />
              Thêm vật tư
            </Button>
          ) : tab === "categories" ? (
            <Button
              onClick={() => {
                setEditingCat(null);
                setCatOpen(true);
              }}
            >
              <Plus className="size-4" />
              Thêm nhóm
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingWh(null);
                setWhOpen(true);
              }}
            >
              <Plus className="size-4" />
              Thêm kho
            </Button>
          )
        }
      />

      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        <TabButton active={tab === "materials"} onClick={() => setTab("materials")}>
          Vật tư ({materials.length})
        </TabButton>
        <TabButton active={tab === "categories"} onClick={() => setTab("categories")}>
          Nhóm hàng ({categories.length})
        </TabButton>
        <TabButton active={tab === "warehouses"} onClick={() => setTab("warehouses")}>
          Kho ({warehouses.length})
        </TabButton>
      </div>

      {tab === "materials" ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm mã, tên, vị trí…"
                className="pl-9"
              />
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
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="size-5" />}
              title="Không có vật tư"
              description="Thử đổi từ khóa hoặc thêm mã mới vào danh mục."
            />
          ) : (
            <>
              <div className="space-y-2 md:hidden">
                {filtered.map((m) => (
                  <article key={m.id} className="rounded-xl bg-card p-4 shadow-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{m.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{m.sku}</p>
                      </div>
                      <RowMenu
                        onEdit={() => {
                          setEditingMat(m);
                          setMatOpen(true);
                        }}
                        onDelete={() => setDeletingMat(m)}
                      />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">Nhóm</dt>
                        <dd>{catName(m.categoryId)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Đơn vị</dt>
                        <dd>{m.unit}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Tồn tối thiểu</dt>
                        <dd className="tabular-nums">{formatNumber(m.minStock)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Vị trí</dt>
                        <dd>{m.location || "—"}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-xl bg-card shadow-card md:block">
                <table className="w-full min-w-[52rem] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3 font-medium">SKU</th>
                      <th className="px-3 py-3 font-medium">Tên</th>
                      <th className="px-3 py-3 font-medium">Nhóm</th>
                      <th className="px-3 py-3 font-medium">ĐVT</th>
                      <th className="px-3 py-3 font-medium">Min</th>
                      <th className="px-3 py-3 font-medium">Đơn giá</th>
                      <th className="px-3 py-3 font-medium">Vị trí</th>
                      <th className="w-12 px-3 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/50"
                      >
                        <td className="px-5 py-3 font-mono text-xs">{m.sku}</td>
                        <td className="px-3 py-3 font-medium">{m.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {catName(m.categoryId)}
                        </td>
                        <td className="px-3 py-3">{m.unit}</td>
                        <td className="px-3 py-3 tabular-nums">{formatNumber(m.minStock)}</td>
                        <td className="px-3 py-3 font-mono tabular-nums">
                          {formatVnd(m.lastUnitPrice)}
                        </td>
                        <td className="px-3 py-3">{m.location || "—"}</td>
                        <td className="px-3 py-3">
                          <RowMenu
                            onEdit={() => {
                              setEditingMat(m);
                              setMatOpen(true);
                            }}
                            onDelete={() => setDeletingMat(m)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ) : tab === "categories" ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => {
            const count = materials.filter((m) => m.categoryId === c.id).length;
            return (
              <article key={c.id} className="rounded-xl bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{c.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.description || "Không có mô tả"}
                    </p>
                  </div>
                  <RowMenu
                    onEdit={() => {
                      setEditingCat(c);
                      setCatOpen(true);
                    }}
                    onDelete={() => setDeletingCat(c)}
                  />
                </div>
                <p className="mt-4 text-sm tabular-nums text-muted-foreground">
                  {count} mã vật tư
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {warehouses.map((w) => (
            <article key={w.id} className="rounded-xl bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{w.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {w.address || "Không có địa chỉ"}
                  </p>
                </div>
                <RowMenu
                  onEdit={() => {
                    setEditingWh(w);
                    setWhOpen(true);
                  }}
                  onDelete={() => setDeletingWh(w)}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <MaterialDialog
        open={matOpen}
        onOpenChange={(v) => {
          setMatOpen(v);
          if (!v) setEditingMat(null);
        }}
        material={editingMat}
      />
      <CategoryDialog
        open={catOpen}
        onOpenChange={(v) => {
          setCatOpen(v);
          if (!v) setEditingCat(null);
        }}
        category={editingCat}
      />
      <WarehouseDialog
        open={whOpen}
        onOpenChange={(v) => {
          setWhOpen(v);
          if (!v) setEditingWh(null);
        }}
        warehouse={editingWh}
      />

      <AlertDialog open={!!deletingMat} onOpenChange={(v) => !v && setDeletingMat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vật tư?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingMat
                ? `Xóa ${deletingMat.name} khỏi danh mục. Không xóa được nếu đã phát sinh tồn kho.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMat}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingCat} onOpenChange={(v) => !v && setDeletingCat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhóm hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingCat
                ? `Xóa nhóm ${deletingCat.name}. Không xóa được nếu vẫn còn vật tư trong nhóm.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCat}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingWh} onOpenChange={(v) => !v && setDeletingWh(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa kho?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingWh
                ? `Xóa kho ${deletingWh.name}. Không xóa được nếu vẫn còn phiếu nhập dùng kho này.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWh}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-10 flex-1 rounded-md bg-card px-3 text-sm font-medium shadow-card"
          : "h-10 flex-1 rounded-md px-3 text-sm font-medium text-muted-foreground"
      }
    >
      {children}
    </button>
  );
}

function RowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Thao tác">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="size-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
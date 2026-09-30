import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import type {
  Category,
  Material,
  Movement,
  Receipt,
  ReceiptLine,
  Warehouse,
  WarehouseData,
} from "./types";

// ── Zod schemas ───────────────────────────────────────────────────────────

const receiptLineSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

const receiptDraftSchema = z.object({
  date: z.string(),
  supplier: z.string(),
  warehouse: z.string(),
  note: z.string(),
  code: z.string().optional(),
  lines: z.array(receiptLineSchema),
});

const materialInputSchema = z.object({
  sku: z.string(),
  name: z.string(),
  categoryId: z.string(),
  unit: z.string(),
  minStock: z.number(),
  location: z.string(),
  note: z.string(),
  lastUnitPrice: z.number(),
});

const categoryInputSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const warehouseInputSchema = z.object({
  name: z.string(),
  address: z.string(),
});

// ── Row types dùng nội bộ cho query ──────────────────────────────────────

type ReceiptRow = {
  id: string;
  code: string;
  date: string;
  supplier: string;
  warehouse: string;
  note: string;
  status: string;
  createdAt: string;
  postedAt: string | null;
  lineCount: number;
  totalValue: number;
};

type ReceiptLineRow = {
  id: string;
  receiptId: string;
  materialId: string;
  quantity: number;
  unitPrice: number;
};

type CountRow = { count: number };
type CodeRow = { code: string };
type StatusRow = { status: string };
type LastPriceRow = { lastUnitPrice: number };
type StockRow = { materialId: string; warehouseId: string | null; qty: number };
type MonthlyInboundRow = { month: string; value: number; qty: number };
type HistoryRow = {
  id: string;
  materialId: string;
  warehouseId: string | null;
  type: string;
  quantity: number;
  unitPrice: number;
  receiptId: string | null;
  note: string;
  createdAt: string;
  materialSku: string | null;
  materialName: string | null;
  materialUnit: string | null;
  receiptCode: string | null;
  receiptSupplier: string | null;
};

const receiptSummarySql = `
  select
    r.id, r.code, r.date::text, r.supplier, r.warehouse, r.note, r.status,
    r.created_at as "createdAt", r.posted_at as "postedAt",
    count(l.id)::int as "lineCount",
    coalesce(sum(l.quantity * l.unit_price), 0)::numeric as "totalValue"
  from warehouse_receipts r
  left join warehouse_receipt_lines l on l.receipt_id = r.id
  group by r.id
`;

function mapReceipt(r: ReceiptRow): Receipt {
  return {
    id: r.id,
    code: r.code,
    date: r.date,
    supplier: r.supplier,
    warehouse: r.warehouse,
    note: r.note,
    status: r.status as Receipt["status"],
    lines: [],
    lineCount: Number(r.lineCount),
    totalValue: Number(r.totalValue),
    createdAt: r.createdAt,
    postedAt: r.postedAt,
  };
}

// ── Load summary data ─────────────────────────────────────────────────────
// Không tải toàn bộ movements/receipt-lines. Tồn và biểu đồ được aggregate ở DB.

export const loadWarehouseData = createServerFn({ method: "GET" }).handler(
  async (): Promise<WarehouseData> => {
    const sql = await getSql();
    const [categories, materials, receiptRows, warehouses, stocks, inboundByMonth] = await Promise.all([
      sql.query<Category>(`select id, name, description from warehouse_categories order by name`),
      sql.query<Material>(
        `select id, sku, name, category_id as "categoryId", unit,
                min_stock as "minStock", location, note,
                last_unit_price as "lastUnitPrice", created_at as "createdAt"
         from warehouse_materials
         order by name`,
      ),
      sql.query<ReceiptRow>(`${receiptSummarySql} order by r.date desc, r.created_at desc limit 200`),
      sql.query<Warehouse>(`select id, name, address from warehouse_warehouses order by name`),
      sql.query<StockRow>(
        `select material_id as "materialId", warehouse_id as "warehouseId", qty
         from warehouse_stock`,
      ),
      sql.query<MonthlyInboundRow>(
        `select to_char(r.date, 'YYYY-MM') as month,
                coalesce(sum(l.quantity * l.unit_price), 0)::numeric as value,
                coalesce(sum(l.quantity), 0)::numeric as qty
         from warehouse_receipts r
         join warehouse_receipt_lines l on l.receipt_id = r.id
         where r.status = 'posted'
           and r.date >= date_trunc('month', current_date) - interval '5 months'
         group by 1
         order by 1`,
      ),
    ]);

    return {
      categories,
      materials,
      receipts: receiptRows.map(mapReceipt),
      movements: [],
      warehouses,
      stocks: stocks.map((row) => ({
        materialId: row.materialId,
        warehouseId: row.warehouseId,
        qty: Number(row.qty),
      })),
      inboundByMonth: inboundByMonth.map((row) => ({
        month: row.month,
        value: Number(row.value),
        qty: Number(row.qty),
      })),
    };
  },
);

export const getReceiptFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Receipt | null> => {
    const sql = await getSql();
    const [rows, lines] = await Promise.all([
      sql.query<ReceiptRow>(`${receiptSummarySql} having r.id = $1`, [data.id]),
      sql.query<ReceiptLineRow>(
        `select id, receipt_id as "receiptId", material_id as "materialId",
                quantity, unit_price as "unitPrice"
         from warehouse_receipt_lines
         where receipt_id = $1
         order by id`,
        [data.id],
      ),
    ]);
    if (!rows[0]) return null;
    return {
      ...mapReceipt(rows[0]),
      lines: lines.map((line) => ({
        id: line.id,
        materialId: line.materialId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    };
  });

export const getWarehouseHistoryFn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
      q: z.string().default(""),
      type: z.enum(["all", "in", "adjust"]).default("all"),
    }),
  )
  .handler(async ({ data }): Promise<import("./types").WarehouseHistoryPage> => {
    const sql = await getSql();
    const limit = data.limit;
    const offset = data.offset;
    const typeFilter = data.type === "all" ? "" : data.type;
    const query = data.q.trim();
    const params: unknown[] = [];
    const where: string[] = [];

    if (typeFilter) {
      params.push(typeFilter);
      where.push(`m.type = $${params.length}`);
    }
    if (query) {
      params.push(`%${query}%`);
      where.push(`(
        m.note ilike $${params.length}
        or coalesce(mat.sku, '') ilike $${params.length}
        or coalesce(mat.name, '') ilike $${params.length}
        or coalesce(r.code, '') ilike $${params.length}
        or coalesce(r.supplier, '') ilike $${params.length}
      )`);
    }
    const whereSql = where.length ? `where ${where.join(" and ")}` : "";
    const countRows = await sql.query<CountRow>(
      `select count(*)::int as count
       from warehouse_movements m
       left join warehouse_materials mat on mat.id = m.material_id
       left join warehouse_receipts r on r.id = m.receipt_id
       ${whereSql}`,
      params,
    );
    const pageParams = [...params, limit, offset];
    const rows = await sql.query<HistoryRow>(
      `select
         m.id, m.material_id as "materialId", m.warehouse_id as "warehouseId",
         m.type, m.quantity, m.unit_price as "unitPrice",
         m.receipt_id as "receiptId", m.note, m.created_at as "createdAt",
         mat.sku as "materialSku", mat.name as "materialName", mat.unit as "materialUnit",
         r.code as "receiptCode", r.supplier as "receiptSupplier"
       from warehouse_movements m
       left join warehouse_materials mat on mat.id = m.material_id
       left join warehouse_receipts r on r.id = m.receipt_id
       ${whereSql}
       order by m.created_at desc, m.id desc
       limit $${pageParams.length - 1} offset $${pageParams.length}`,
      pageParams,
    );
    return {
      rows: rows.map((row) => ({ ...row, quantity: Number(row.quantity), unitPrice: Number(row.unitPrice) })),
      total: countRows[0]?.count ?? 0,
      limit,
      offset,
    };
  });

// ── Category ──────────────────────────────────────────────────────────────

export const addCategoryFn = createServerFn({ method: "POST" })
  .validator(categoryInputSchema)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = uid("cat");
    await sql.query(
      `insert into warehouse_categories (id, name, description) values ($1, $2, $3)`,
      [id, data.name, data.description],
    );
    return id;
  });

export const updateCategoryFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), input: categoryInputSchema }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `update warehouse_categories set name = $1, description = $2 where id = $3`,
      [data.input.name, data.input.description, data.id],
    );
  });

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    const sql = await getSql();
    const used = await sql.query<CountRow>(
      `select count(*)::int as count from warehouse_materials where category_id = $1`,
      [data.id],
    );
    if ((used[0]?.count ?? 0) > 0) return "Không thể xóa nhóm đang có vật tư.";
    await sql.query(`delete from warehouse_categories where id = $1`, [data.id]);
    return null;
  });


  // ── Warehouse ─────────────────────────────────────────────────────────────

export const addWarehouseFn = createServerFn({ method: "POST" })
  .validator(warehouseInputSchema)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = uid("wh");
    await sql.query(
      `insert into warehouse_warehouses (id, name, address) values ($1, $2, $3)`,
      [id, data.name, data.address],
    );
    return id;
  });

export const updateWarehouseFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), input: warehouseInputSchema }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `update warehouse_warehouses set name = $1, address = $2 where id = $3`,
      [data.input.name, data.input.address, data.id],
    );
  });

export const deleteWarehouseFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    const sql = await getSql();
    const rows = await sql.query<{ name: string }>(
      `select name from warehouse_warehouses where id = $1`,
      [data.id],
    );
    if (rows.length === 0) return "Không tìm thấy kho.";
    const used = await sql.query<CountRow>(
      `select count(*)::int as count from warehouse_receipts where warehouse = $1`,
      [rows[0].name],
    );
    if ((used[0]?.count ?? 0) > 0) return "Không thể xóa kho đang có phiếu nhập.";
    await sql.query(`delete from warehouse_warehouses where id = $1`, [data.id]);
    return null;
  });

  

// ── Material ──────────────────────────────────────────────────────────────

export const addMaterialFn = createServerFn({ method: "POST" })
  .validator(materialInputSchema)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = uid("mat");
    await sql.query(
      `insert into warehouse_materials
         (id, sku, name, category_id, unit, min_stock, location, note, last_unit_price)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        id,
        data.sku,
        data.name,
        data.categoryId,
        data.unit,
        data.minStock,
        data.location,
        data.note,
        data.lastUnitPrice,
      ],
    );
    return id;
  });

export const updateMaterialFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), input: materialInputSchema }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const i = data.input;
    await sql.query(
      `update warehouse_materials
       set sku = $1, name = $2, category_id = $3, unit = $4, min_stock = $5,
           location = $6, note = $7, last_unit_price = $8
       where id = $9`,
      [i.sku, i.name, i.categoryId, i.unit, i.minStock, i.location, i.note, i.lastUnitPrice, data.id],
    );
  });

export const deleteMaterialFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    const sql = await getSql();

    const [movementCount, lineCount] = await Promise.all([
      sql.query<CountRow>(
        `select count(*)::int as count from warehouse_movements where material_id = $1`,
        [data.id],
      ),
      sql.query<CountRow>(
        `select count(*)::int as count from warehouse_receipt_lines where material_id = $1`,
        [data.id],
      ),
    ]);
    if ((movementCount[0]?.count ?? 0) > 0) {
      return "Không thể xóa vật tư đã phát sinh tồn kho.";
    }
    if ((lineCount[0]?.count ?? 0) > 0) {
      return "Không thể xóa vật tư đang nằm trên phiếu nhập.";
    }

    await sql.query(`delete from warehouse_materials where id = $1`, [data.id]);
    return null;
  });

// ── Receipt ───────────────────────────────────────────────────────────────

async function nextReceiptCode(date: string): Promise<string> {
  const sql = await getSql();
  const year = date.slice(0, 4) || String(new Date().getFullYear());
  const prefix = `PN-${year}-`;
  const rows = await sql.query<CodeRow>(
    `select code from warehouse_receipts where code like $1`,
    [`${prefix}%`],
  );
  let max = 0;
  for (const r of rows) {
    const n = Number(r.code.slice(prefix.length));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

function buildLineInsert(receiptId: string, lines: ReceiptLine[]) {
  const values = lines
    .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
    .join(", ");
  const params = lines.flatMap((line) => [
    uid("ln"),
    receiptId,
    line.materialId,
    line.quantity,
    line.unitPrice,
  ]);
  return { values, params };
}

export const saveReceiptFn = createServerFn({ method: "POST" })
  .validator(z.object({ input: receiptDraftSchema, existingId: z.string().optional() }))
  .handler(async ({ data }): Promise<string> => {
    const sql = await getSql();
    const { input, existingId } = data;

    if (existingId) {
      const existing = await sql.query<StatusRow>(
        `select status from warehouse_receipts where id = $1`,
        [existingId],
      );
      if (existing.length === 0 || existing[0].status === "posted") return existingId;

      // Cập nhật phần meta của phiếu và xóa các dòng cũ song song — cả hai
      // đều không phụ thuộc lẫn nhau, chỉ phải xong trước khi chèn dòng mới.
      await Promise.all([
        sql.query(
          `update warehouse_receipts set date = $1, supplier = $2, warehouse = $3, note = $4 where id = $5`,
          [input.date, input.supplier, input.warehouse, input.note, existingId],
        ),
        sql.query(`delete from warehouse_receipt_lines where receipt_id = $1`, [existingId]),
      ]);

      if (input.lines.length > 0) {
        const { values, params } = buildLineInsert(existingId, input.lines);
        await sql.query(
          `insert into warehouse_receipt_lines (id, receipt_id, material_id, quantity, unit_price) values ${values}`,
          params,
        );
      }
      return existingId;
    }

    const id = uid("rcpt");
    const code = input.code?.trim() || (await nextReceiptCode(input.date));
    await sql.query(
      `insert into warehouse_receipts (id, code, date, supplier, warehouse, note, status)
       values ($1, $2, $3, $4, $5, $6, 'draft')`,
      [id, code, input.date, input.supplier, input.warehouse, input.note],
    );
    if (input.lines.length > 0) {
      const { values, params } = buildLineInsert(id, input.lines);
      await sql.query(
        `insert into warehouse_receipt_lines (id, receipt_id, material_id, quantity, unit_price) values ${values}`,
        params,
      );
    }
    return id;
  });

export const postReceiptFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    const sql = await getSql();

    const [receiptRows, lines] = await Promise.all([
      sql.query<{ id: string; code: string; status: string; supplier: string; warehouse: string }>(
        `select id, code, status, supplier, warehouse from warehouse_receipts where id = $1`,
        [data.id],
      ),
      sql.query<ReceiptLine>(
        `select id, material_id as "materialId", quantity, unit_price as "unitPrice"
         from warehouse_receipt_lines where receipt_id = $1`,
        [data.id],
      ),
    ]);
    const receipt = receiptRows[0];
    if (!receipt) return "Không tìm thấy phiếu.";
    if (receipt.status === "posted") return "Phiếu đã ghi sổ.";
    if (!receipt.supplier.trim()) return "Nhập nhà cung cấp trước khi ghi sổ.";
    if (lines.length === 0) return "Phiếu chưa có dòng vật tư.";
    if (lines.some((l) => !l.materialId || l.quantity <= 0)) {
      return "Mỗi dòng cần chọn vật tư và số lượng lớn hơn 0.";
    }

    // Ghi movement cho tất cả các dòng bằng 1 câu insert nhiều dòng.
    const warehouseRows = await sql.query<{ id: string }>(
      `select id from warehouse_warehouses where name = $1`,
      [receipt.warehouse],
    );
    const warehouseId = warehouseRows[0]?.id ?? null;
    const movementValues = lines
      .map((_, i) => `(${i * 7 + 1}, ${i * 7 + 2}, 'in', ${i * 7 + 3}, ${i * 7 + 4}, ${i * 7 + 5}, ${i * 7 + 6}, ${i * 7 + 7})`)
      .join(", ");
    const movementParams = lines.flatMap((line) => [
      uid("mv"),
      line.materialId,
      line.quantity,
      line.unitPrice,
      data.id,
      `Nhập kho ${receipt.code}`,
      warehouseId,
    ]);

    // Cập nhật giá gần nhất cho từng vật tư bằng 1 câu update nhiều dòng
    // (trùng vật tư trong cùng phiếu thì dòng sau đè giá dòng trước, giống
    // hành vi vòng lặp cũ).
    const priceByMaterial = new Map<string, number>();
    for (const line of lines) priceByMaterial.set(line.materialId, line.unitPrice);
    const priceEntries = [...priceByMaterial.entries()];
    const priceValues = priceEntries
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2}::numeric)`)
      .join(", ");
    const priceParams = priceEntries.flatMap(([id, price]) => [id, price]);

    // 3 câu ghi độc lập nhau (bảng khác nhau, không phụ thuộc thứ tự) —
    // chạy song song thay vì tuần tự.
    await Promise.all([
      sql.query(
        `update warehouse_receipts set status = 'posted', posted_at = now() where id = $1`,
        [data.id],
      ),
      sql.query(
        `insert into warehouse_movements (id, material_id, type, quantity, unit_price, receipt_id, note, warehouse_id)
         values ${movementValues}`,
        movementParams,
      ),
      sql.query(
        `update warehouse_materials as m set last_unit_price = v.price
         from (values ${priceValues}) as v(id, price)
         where m.id = v.id`,
        priceParams,
      ),
    ]);

    return null;
  });

export const deleteReceiptFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    const sql = await getSql();
    const rows = await sql.query<StatusRow>(
      `select status from warehouse_receipts where id = $1`,
      [data.id],
    );
    if (rows.length === 0) return "Không tìm thấy phiếu.";
    if (rows[0].status === "posted") {
      // Xóa bút toán tồn kho phát sinh từ phiếu này trước — điều này tự
      // hoàn tác ảnh hưởng lên tồn kho, vì stockOf() cộng dồn movements.
      // Dòng phiếu (warehouse_receipt_lines) tự xóa theo cascade FK.
      await sql.query(`delete from warehouse_movements where receipt_id = $1`, [data.id]);
    }
    await sql.query(`delete from warehouse_receipts where id = $1`, [data.id]);
    return null;
  });

// ── Adjust stock ──────────────────────────────────────────────────────────

export const adjustStockFn = createServerFn({ method: "POST" })
  .validator(z.object({ materialId: z.string(), quantity: z.number(), note: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    if (!data.materialId) return "Chọn vật tư.";
    if (!data.quantity || data.quantity === 0) return "Số lượng điều chỉnh phải khác 0.";
    if (!data.note.trim()) return "Nhập lý do điều chỉnh.";

    const sql = await getSql();
    const rows = await sql.query<LastPriceRow>(
      `select last_unit_price as "lastUnitPrice" from warehouse_materials where id = $1`,
      [data.materialId],
    );
    if (rows.length === 0) return "Không tìm thấy vật tư.";

    await sql.query(
      `insert into warehouse_movements (id, material_id, type, quantity, unit_price, receipt_id, note, warehouse_id)
       values ($1, $2, 'adjust', $3, $4, null, $5, $6)`,
      [uid("mv"), data.materialId, data.quantity, rows[0].lastUnitPrice, data.note.trim(), null],
    );
    return null;
  });
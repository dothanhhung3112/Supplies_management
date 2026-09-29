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

// ── Load toàn bộ dữ liệu (5 query chạy song song thay vì tuần tự) ────────

export const loadWarehouseData = createServerFn({ method: "GET" }).handler(
  async (): Promise<WarehouseData> => {
    const sql = await getSql();

    const [categories, materials, receiptRows, lineRows, movements] = await Promise.all([
      sql.query<Category>(
        `select id, name, description from warehouse_categories`,
      ),
      sql.query<Material>(
        `select id, sku, name, category_id as "categoryId", unit,
                min_stock as "minStock", location, note,
                last_unit_price as "lastUnitPrice", created_at as "createdAt"
         from warehouse_materials`,
      ),
      sql.query<ReceiptRow>(
        `select id, code, date::text, supplier, warehouse, note, status,
                created_at as "createdAt", posted_at as "postedAt"
         from warehouse_receipts
         order by date desc, created_at desc`,
      ),
      sql.query<ReceiptLineRow>(
        `select id, receipt_id as "receiptId", material_id as "materialId",
                quantity, unit_price as "unitPrice"
         from warehouse_receipt_lines`,
      ),
      sql.query<Movement>(
        `select id, material_id as "materialId", type, quantity,
                unit_price as "unitPrice", receipt_id as "receiptId",
                note, created_at as "createdAt"
         from warehouse_movements
         order by created_at desc`,
      ),
    ]);

    const linesByReceipt = new Map<string, ReceiptLine[]>();
    for (const line of lineRows) {
      const list = linesByReceipt.get(line.receiptId) ?? [];
      list.push({
        id: line.id,
        materialId: line.materialId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      });
      linesByReceipt.set(line.receiptId, list);
    }

    const receipts: Receipt[] = receiptRows.map((r) => ({
      id: r.id,
      code: r.code,
      date: r.date,
      supplier: r.supplier,
      warehouse: r.warehouse,
      note: r.note,
      status: r.status as Receipt["status"],
      createdAt: r.createdAt,
      postedAt: r.postedAt,
      lines: linesByReceipt.get(r.id) ?? [],
    }));

    return { categories, materials, receipts, movements };
  },
);

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
      sql.query<{ id: string; code: string; status: string; supplier: string }>(
        `select id, code, status, supplier from warehouse_receipts where id = $1`,
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
    const movementValues = lines
      .map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, 'in', $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
      .join(", ");
    const movementParams = lines.flatMap((line) => [
      uid("mv"),
      line.materialId,
      line.quantity,
      line.unitPrice,
      data.id,
      `Nhập kho ${receipt.code}`,
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
        `insert into warehouse_movements (id, material_id, type, quantity, unit_price, receipt_id, note)
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
    if (rows[0].status === "posted") return "Không thể xóa phiếu đã ghi sổ.";
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
      `insert into warehouse_movements (id, material_id, type, quantity, unit_price, receipt_id, note)
       values ($1, $2, 'adjust', $3, $4, null, $5)`,
      [uid("mv"), data.materialId, data.quantity, rows[0].lastUnitPrice, data.note.trim()],
    );
    return null;
  });
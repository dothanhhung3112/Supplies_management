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
  MaterialImportRow,
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
  warehouseId: z.string(),
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
  warehouseId: string | null;
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
  warehouseName: string | null;
};

const receiptSummarySql = `
  select
    r.id, r.code, r.date::text, r.supplier,
    r.warehouse_id as "warehouseId", coalesce(w.name, 'Kho đã xóa') as warehouse,
    r.note, r.status,
    r.created_at as "createdAt", r.posted_at as "postedAt",
    count(l.id)::int as "lineCount",
    coalesce(sum(l.quantity * l.unit_price), 0)::numeric as "totalValue"
  from warehouse_receipts r
  left join warehouse_warehouses w on w.id = r.warehouse_id
  left join warehouse_receipt_lines l on l.receipt_id = r.id
  group by r.id, w.name
`;

function mapReceipt(r: ReceiptRow): Receipt {
  return {
    id: r.id,
    code: r.code,
    date: r.date,
    supplier: r.supplier,
    warehouseId: r.warehouseId,
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
        `select
           m.id as "materialId",
           w.id as "warehouseId",
           coalesce(sum(mv.quantity), 0)::numeric as qty
         from warehouse_materials m
         cross join warehouse_warehouses w
         left join warehouse_movements mv
           on mv.material_id = m.id
          and mv.warehouse_id = w.id
         group by m.id, w.id`,
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
      type: z.enum(["all", "in", "adjust", "reverse"]).default("all"),
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
        unaccent(m.note) ilike unaccent(${params.length})
        or unaccent(coalesce(mat.sku, '')) ilike unaccent(${params.length})
        or unaccent(coalesce(mat.name, '')) ilike unaccent(${params.length})
        or unaccent(coalesce(r.code, '')) ilike unaccent(${params.length})
        or unaccent(coalesce(r.supplier, '')) ilike unaccent(${params.length})
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
         r.code as "receiptCode", r.supplier as "receiptSupplier",
         w.name as "warehouseName"
       from warehouse_movements m
       left join warehouse_materials mat on mat.id = m.material_id
       left join warehouse_receipts r on r.id = m.receipt_id
       left join warehouse_warehouses w on w.id = m.warehouse_id
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


const materialImportSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      name: z.string(),
      unit: z.string(),
      quantity: z.number(),
      needsReview: z.boolean(),
      warning: z.string(),
    }),
  ),
});

const materialImportItemSchema = z.object({
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  unit: z.string().trim().min(1),
  categoryId: z.string().min(1),
  minStock: z.number().min(0),
  location: z.string(),
  note: z.string(),
  lastUnitPrice: z.number().min(0),
});

export const ocrMaterialsFromImagesFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      images: z.array(z.string().startsWith("data:image/")).min(1).max(4),
    }),
  )
  .handler(async ({ data }): Promise<MaterialImportRow[]> => {
    const apiKey = typeof process !== "undefined" ? process.env.XAI_API_KEY : undefined;
    if (!apiKey) {
      throw new Error("Chưa cấu hình XAI_API_KEY cho chức năng đọc ảnh.");
    }

    const totalBytes = data.images.reduce((sum, image) => sum + Math.ceil((image.length * 3) / 4), 0);
    if (totalBytes > 6_000_000) {
      throw new Error("Ảnh quá lớn. Hãy chụp lại hoặc chọn ảnh có dung lượng nhỏ hơn.");
    }

    const schema = {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sku: { type: "string" },
              name: { type: "string" },
              unit: { type: "string" },
              quantity: { type: "number" },
              needsReview: { type: "boolean" },
              warning: { type: "string" },
            },
            required: ["sku", "name", "unit", "quantity", "needsReview", "warning"],
            additionalProperties: false,
          },
        },
      },
      required: ["items"],
      additionalProperties: false,
    };

    const content = [
      {
        type: "input_text",
        text:
          "Đọc ảnh bảng danh sách vật tư và trích xuất từng dòng hàng. " +
          "Đây là dữ liệu để tạo danh mục vật tư, không phải để ghi tồn kho. " +
          "Chỉ lấy các cột Mã hàng, Tên hàng, ĐVT và Số lượng. " +
          "Giữ nguyên mã hàng và tên hàng như trên ảnh, đặc biệt không tự sửa hoặc suy đoán ký tự của SKU. " +
          "Số lượng là số tham khảo từ ảnh và không được dùng để tạo tồn kho ở bước này. " +
          "Bỏ qua tiêu đề, STT, cột ghi chú và các dòng không phải vật tư. " +
          "Nếu có nhiều ảnh, ghép các dòng theo thứ tự xuất hiện và không bỏ sót dòng. " +
          "Nếu một ô khó đọc, để needsReview=true và mô tả ngắn gọn điểm nghi ngờ trong warning thay vì đoán. " +
          "Nếu đọc rõ thì needsReview=false và warning là chuỗi rỗng.",
      },
      ...data.images.map((image) => ({ type: "input_image", image_url: image })),
    ];

    const response = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4.7",
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "material_import",
            schema,
            strict: true,
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[material-ocr] xAI request failed:", detail);
      throw new Error("Không đọc được ảnh. Hãy thử ảnh rõ hơn.");
    }

    const payload = (await response.json()) as {
      output_text?: string;
      output?: Array<{
        type?: string;
        content?: Array<{ type?: string; text?: string }>;
      }>;
    };

    const outputText =
      payload.output_text ??
      payload.output
        ?.find((item) => item.type === "message")
        ?.content?.find((item) => item.type === "output_text")?.text;

    if (!outputText) throw new Error("AI không trả về dữ liệu OCR.");

    const parsed = materialImportSchema.parse(JSON.parse(outputText));
    const sql = await getSql();
    const normalizedSkus = [...new Set(parsed.items.map((item) => item.sku.trim().toLowerCase()).filter(Boolean))];
    const existing = normalizedSkus.length
      ? await sql.query<{ id: string; sku: string }>(
          `select id, sku
           from warehouse_materials
           where lower(sku) in (${normalizedSkus.map((_, i) => "$" + (i + 1)).join(", ")})`,
          normalizedSkus,
        )
      : [];
    const existingBySku = new Map(existing.map((row) => [row.sku.trim().toLowerCase(), row]));

    return parsed.items.map((item) => {
      const sku = item.sku.trim();
      const match = existingBySku.get(sku.toLowerCase());
      return {
        sku,
        name: item.name.trim(),
        unit: item.unit.trim(),
        quantity: Number.isFinite(item.quantity) ? item.quantity : 0,
        needsReview: item.needsReview,
        warning: item.warning.trim(),
        existingMaterialId: match?.id,
      };
    });
  });

export const addMaterialsFromImportFn = createServerFn({ method: "POST" })
  .validator(z.object({ items: z.array(materialImportItemSchema).min(1).max(200) }))
  .handler(async ({ data }): Promise<{ added: number; skipped: string[] }> => {
    const sql = await getSql();
    const normalizedSkus = [...new Set(data.items.map((item) => item.sku.toLowerCase()))];
    const existing = normalizedSkus.length
      ? await sql.query<{ sku: string }>(
          `select sku
           from warehouse_materials
           where lower(sku) in (${normalizedSkus.map((_, i) => "$" + (i + 1)).join(", ")})`,
          normalizedSkus,
        )
      : [];
    const existingSkus = new Set(existing.map((row) => row.sku.toLowerCase()));
    const seen = new Set<string>();
    const skipped: string[] = [];
    let added = 0;

    for (const item of data.items) {
      const sku = item.sku.trim().toUpperCase();
      const key = sku.toLowerCase();
      if (existingSkus.has(key) || seen.has(key)) {
        skipped.push(sku);
        continue;
      }
      seen.add(key);
      await sql.query(
        `insert into warehouse_materials
           (id, sku, name, category_id, unit, min_stock, location, note, last_unit_price)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          uid("mat"),
          sku,
          item.name.trim(),
          item.categoryId,
          item.unit.trim(),
          item.minStock,
          item.location.trim(),
          item.note.trim(),
          item.lastUnitPrice,
        ],
      );
      added += 1;
    }

    return { added, skipped };
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
    const rows = await sql.query<{ id: string }>(
      `select id from warehouse_warehouses where id = $1`,
      [data.id],
    );
    if (rows.length === 0) return "Không tìm thấy kho.";
    const [stockUsage, draftReceiptUsage] = await Promise.all([
      sql.query<CountRow>(
        `select count(*)::int as count
         from (
           select material_id
           from warehouse_movements
           where warehouse_id = $1
           group by material_id
           having coalesce(sum(quantity), 0) <> 0
         ) stock`,
        [data.id],
      ),
      sql.query<CountRow>(
        `select count(*)::int as count
         from warehouse_receipts
         where warehouse_id = $1 and status = 'draft'`,
        [data.id],
      ),
    ]);
    if ((stockUsage[0]?.count ?? 0) > 0) {
      return "Không thể xóa kho khi vẫn còn tồn kho khác 0.";
    }
    if ((draftReceiptUsage[0]?.count ?? 0) > 0) {
      return "Không thể xóa kho đang có phiếu nhập nháp.";
    }

    // Historical posted/cancelled receipts and movements are preserved.
    // The migration changes their warehouse FK to ON DELETE SET NULL.
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
          `update warehouse_receipts set date = $1, supplier = $2, warehouse_id = $3, note = $4 where id = $5`,
          [input.date, input.supplier, input.warehouseId, input.note, existingId],
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
      `insert into warehouse_receipts (id, code, date, supplier, warehouse_id, note, status)
       values ($1, $2, $3, $4, $5, $6, 'draft')`,
      [id, code, input.date, input.supplier, input.warehouseId, input.note],
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
      sql.query<{ id: string; code: string; status: string; supplier: string; warehouseId: string }>(
        `select id, code, status, supplier, warehouse_id as "warehouseId" from warehouse_receipts where id = $1`,
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
    if (receipt.status === "cancelled") return "Phiếu đã hủy.";
    if (!receipt.supplier.trim()) return "Nhập nhà cung cấp trước khi ghi sổ.";
    if (lines.length === 0) return "Phiếu chưa có dòng vật tư.";
    if (lines.some((l) => !l.materialId || l.quantity <= 0)) {
      return "Mỗi dòng cần chọn vật tư và số lượng lớn hơn 0.";
    }

    // Ghi movement cho tất cả các dòng vào đúng kho của phiếu.
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
      receipt.warehouseId,
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
    if (rows[0].status === "cancelled") return "Phiếu đã được hủy.";
    if (rows[0].status === "posted") {
      const movements = await sql.query<{
        id: string;
        materialId: string;
        quantity: number;
        unitPrice: number;
        warehouseId: string;
      }>(
        `select id, material_id as "materialId", quantity, unit_price as "unitPrice",
                warehouse_id as "warehouseId"
         from warehouse_movements
         where receipt_id = $1
         order by created_at, id`,
        [data.id],
      );

      if (movements.length === 0) return "Phiếu đã ghi sổ nhưng chưa có bút toán tồn kho để hoàn tác.";

      for (const movement of movements) {
        await sql.query(
          `insert into warehouse_movements
             (id, material_id, type, quantity, unit_price, receipt_id, note, warehouse_id)
           values ($1, $2, 'reverse', $3, $4, $5, $6, $7)`,
          [
            uid("mv"),
            movement.materialId,
            -Number(movement.quantity),
            movement.unitPrice,
            data.id,
            `Hoàn tác phiếu ${data.id}`,
            movement.warehouseId,
          ],
        );
      }

      await sql.query(
        `update warehouse_receipts set status = 'cancelled' where id = $1`,
        [data.id],
      );
      return null;
    }
    await sql.query(`delete from warehouse_receipts where id = $1`, [data.id]);
    return null;
  });

// ── Adjust stock ──────────────────────────────────────────────────────────

export const adjustStockFn = createServerFn({ method: "POST" })
  .validator(z.object({ materialId: z.string(), warehouseId: z.string(), quantity: z.number(), note: z.string() }))
  .handler(async ({ data }): Promise<string | null> => {
    if (!data.materialId) return "Chọn vật tư.";
    if (!data.warehouseId) return "Chọn kho.";
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
      [uid("mv"), data.materialId, data.quantity, rows[0].lastUnitPrice, data.note.trim(), data.warehouseId],
    );
    return null;
  });
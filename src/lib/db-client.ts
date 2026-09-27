import { PGlite } from "@electric-sql/pglite";

let clientPgInstance: PGlite | null = null;

export async function getClientDb() {
  if (typeof window === "undefined") return null; // Chỉ chạy trên browser

  if (!clientPgInstance) {
    // Khởi tạo PGlite lưu vào IndexedDB
    clientPgInstance = new PGlite("idb://supplies_db");
    await clientPgInstance.waitReady;

    // Chạy khởi tạo bảng/migrations trực tiếp trên trình duyệt
    await clientPgInstance.exec(`
      CREATE TABLE IF NOT EXISTS supplies (
        id SERIAL PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        unit TEXT,
        min_qty INT,
        price NUMERIC,
        location TEXT
      );
    `);
  }

  return clientPgInstance;
}
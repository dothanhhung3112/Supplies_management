import { config } from "dotenv";
config();

console.log("DATABASE_URL set:", Boolean(process.env.DATABASE_URL));
console.log("dbSource sẽ là:", process.env.DATABASE_URL ? "neon" : "pglite");

if (process.env.DATABASE_URL) {
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const res = await pool.query("select current_database(), now()");
  console.log("Kết nối Neon OK:", res.rows[0]);
  await pool.end();
}
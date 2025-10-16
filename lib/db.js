import { Pool } from "pg";

let pool;

export async function connectToDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL, // Neon-style URL
      ssl: {
        rejectUnauthorized: false, // required for Neon
      },
    });
  }
  return pool;
}
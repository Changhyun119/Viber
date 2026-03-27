import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db, sql } from "../src/db";

async function main() {
  await sql`create extension if not exists pgcrypto;`;
  await sql`create extension if not exists pg_trgm;`;

  await migrate(db, {
    migrationsFolder: "src/db/migrations"
  });

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

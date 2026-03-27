import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:54329/vibe_showcase";

declare global {
  var __vibeSql__: ReturnType<typeof postgres> | undefined;
}

const sql = global.__vibeSql__ || postgres(connectionString, {
  max: process.env.NODE_ENV === "development" ? 5 : 10
});

if (process.env.NODE_ENV !== "production") {
  global.__vibeSql__ = sql;
}

export const db = drizzle(sql, { schema, casing: "snake_case" });
export { sql };

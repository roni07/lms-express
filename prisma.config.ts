import "dotenv/config";
import { defineConfig } from "prisma/config";
import { buildDatabaseUrl } from "./src/config/database-url.js";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

// Some commands (e.g. `prisma generate` on install) don't need a database, so only build the URL when configured
const url =
  DB_HOST && DB_USERNAME && DB_NAME
    ? buildDatabaseUrl({
        host: DB_HOST,
        port: DB_PORT ?? 5432,
        user: DB_USERNAME,
        password: DB_PASSWORD ?? "",
        name: DB_NAME,
      })
    : undefined;

export default defineConfig({
  // Every .prisma file under src/ is part of the schema (base file + one per module)
  schema: "src",
  migrations: {
    path: "src/database/migrations",
  },
  datasource: {
    url,
  },
});

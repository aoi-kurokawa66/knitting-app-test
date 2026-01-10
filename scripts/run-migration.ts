import { config } from "dotenv";
import { resolve } from "path";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

// .env.localを読み込む
config({ path: resolve(process.cwd(), ".env.local") });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("POSTGRES_URL environment variable is not set");
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: "require",
});

async function runMigration() {
  try {
    const migrationFile = join(process.cwd(), "migrations", "003_add_category_to_projects.sql");
    const migrationSQL = readFileSync(migrationFile, "utf-8");
    
    console.log("Running migration: 003_add_category_to_projects.sql");
    await sql.unsafe(migrationSQL);
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();


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
  const migrations = [
    "001_create_projects_table.sql",
    "002_create_patterns_table.sql",
    "003_add_category_to_projects.sql",
    "004_create_completed_images_table.sql",
  ];

  try {
    for (const migrationFile of migrations) {
      const migrationPath = join(process.cwd(), "migrations", migrationFile);
      const migrationSQL = readFileSync(migrationPath, "utf-8");
      
      console.log(`Running migration: ${migrationFile}`);
      try {
        await sql.unsafe(migrationSQL);
        console.log(`✓ ${migrationFile} completed`);
      } catch (error: any) {
        // 既に存在するオブジェクトのエラーは無視
        if (error?.code === '42P07' || error?.code === '42710' || error?.code === '23505') {
          console.log(`⚠ ${migrationFile}: Some objects already exist, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log("\n✅ All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();


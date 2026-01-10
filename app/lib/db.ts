import postgres from "postgres";

// データベース接続の設定
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// PostgreSQL接続クライアントの作成
export const sql = postgres(connectionString, {
  ssl: "require",
  // 準備済みステートメントを無効化してスキーマ変更時のキャッシュ問題を回避
  prepare: false,
});

// データベース接続の確認用（開発時に使用）
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
}

// 型定義（後で使用）
export type Category = "かぎ針" | "ぼう針" | null;

export type Project = {
  id: number;
  title: string;
  description: string | null;
  completed_image_url: string | null;
  youtube_url: string | null;
  yarn_color_count: number;
  category: Category;
  created_at: Date;
  updated_at: Date;
};

export type Pattern = {
  id: number;
  project_id: number;
  image_url: string;
  display_order: number;
  created_at: Date;
};

// 作品一覧を取得する関数
export async function getProjects() {
  try {
    const projects = await sql<Project[]>`
      SELECT * FROM projects
      ORDER BY created_at DESC
    `;
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// 作品の詳細を取得する関数（編み図も含む）
export async function getProjectById(id: number) {
  try {
    const [project] = await sql<Project[]>`
      SELECT * FROM projects WHERE id = ${id}
    `;
    
    if (!project) {
      return null;
    }
    
    const patterns = await sql<Pattern[]>`
      SELECT * FROM patterns
      WHERE project_id = ${id}
      ORDER BY display_order ASC
    `;
    
    return {
      ...project,
      patterns: patterns || [],
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}


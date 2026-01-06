import { sql } from "@vercel/postgres";

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
export type Project = {
  id: number;
  title: string;
  description: string | null;
  completed_image_url: string | null;
  youtube_url: string | null;
  yarn_color_count: number;
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


-- 完成写真テーブル
CREATE TABLE IF NOT EXISTS completed_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成（検索パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_completed_images_project_id ON completed_images(project_id);
CREATE INDEX IF NOT EXISTS idx_completed_images_display_order ON completed_images(project_id, display_order);

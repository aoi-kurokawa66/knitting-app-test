-- 作品テーブルにカテゴリカラムを追加（既に存在する場合は何もしない）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'category'
    ) THEN
        ALTER TABLE projects 
        ADD COLUMN category VARCHAR(10) CHECK (category IN ('かぎ針', 'ぼう針'));
    END IF;
END $$;

-- 既存のレコードにはNULLが設定される（後で手動で設定可能）


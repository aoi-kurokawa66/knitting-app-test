# データベースセットアップ手順

## 1. Vercel Postgresの作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択（または新規作成）
3. 「Storage」タブをクリック
4. 「Create Database」→「Postgres」を選択
5. データベース名を入力して作成

## 2. 環境変数の設定

Vercelダッシュボードで作成したPostgresデータベースの「.env.local」タブから、以下の環境変数をコピー：

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

### ローカル開発環境での設定

プロジェクトのルートに `.env.local` ファイルを作成し、上記の環境変数を貼り付け：

```bash
# .env.local
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
# ... など
```

**注意**: `.env.local` はGitにコミットしないでください（既に.gitignoreに含まれています）

## 3. テーブルの作成

VercelダッシュボードのPostgresデータベースページで：

1. 「Query」タブを開く
2. `migrations/001_create_projects_table.sql` の内容をコピーして実行
3. `migrations/002_create_patterns_table.sql` の内容をコピーして実行

または、Vercel CLIを使用する場合：

```bash
vercel env pull .env.local
# その後、psqlコマンドで実行
```

## 4. 接続確認

開発サーバーを起動して、データベース接続を確認：

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開いて動作確認。


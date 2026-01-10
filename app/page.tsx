import { getProjects } from "./lib/db";
import ProjectList from "./components/ProjectList";

// キャッシュを無効化して常に最新データを取得
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          作品一覧
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          みんなの編み物作品を見て、一緒に編もう
        </p>
        {/* デバッグ用: 作品数を表示 */}
        {process.env.NODE_ENV === "development" && (
          <p className="mt-1 text-xs text-zinc-400">
            作品数: {projects.length}
          </p>
        )}
      </div>

      {/* 作品一覧（カテゴリフィルター付き） */}
      <ProjectList projects={projects} />
    </div>
  );
}

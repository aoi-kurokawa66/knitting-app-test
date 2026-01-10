import { getProjects } from "../lib/db";
import GalleryGrid from "../components/GalleryGrid";

// キャッシュを無効化して常に最新データを取得
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          完成写真ギャラリー
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          みんなの完成作品を写真で見る
        </p>
      </div>

      {/* 完成写真ギャラリー（カテゴリフィルター付き） */}
      <GalleryGrid projects={projects} />
    </div>
  );
}


import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectById } from "../../lib/db";
import DeleteButton from "../../components/DeleteButton";
import ImageGallery from "../../components/ImageGallery";
import PatternLink from "../../components/PatternLink";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 戻るボタン */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← 作品一覧に戻る
      </Link>

      {/* 作品タイトル */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {project.title}
        </h1>
        {project.description && (
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
        )}
      </div>

      {/* 完成写真 */}
      {project.completed_image_url && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            完成写真
          </h2>
          <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={project.completed_image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 編み図ギャラリー */}
      {project.patterns && project.patterns.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            編み図
          </h2>
          
          {/* 画像ギャラリー（拡大プレビュー機能付き） */}
          <ImageGallery images={project.patterns} />

          {/* PDFとURLリンクの表示 */}
          {project.patterns.filter(
            (pattern) =>
              pattern.image_url.startsWith("data:application/pdf") ||
              (pattern.image_url.startsWith("http") &&
                !pattern.image_url.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          ).length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.patterns
                .filter(
                  (pattern) =>
                    pattern.image_url.startsWith("data:application/pdf") ||
                    (pattern.image_url.startsWith("http") &&
                      !pattern.image_url.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                )
                .map((pattern) => (
                  <PatternLink key={pattern.id} pattern={pattern} />
                ))}
            </div>
          )}
        </div>
      )}

      {/* 作品情報 */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          作品情報
        </h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              必要な糸の色の数
            </dt>
            <dd className="mt-1 text-lg text-zinc-900 dark:text-zinc-50">
              {project.yarn_color_count}色
            </dd>
          </div>
          {project.youtube_url && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                YouTube動画
              </dt>
              <dd className="mt-1">
                <a
                  href={project.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                >
                  <span>▶</span>
                  <span>YouTubeで見る</span>
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* AI機能（後で実装） */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          色の提案
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          AI機能は後で実装予定です
        </p>
      </div>

      {/* 編集・削除ボタン */}
      <div className="flex gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Link
          href={`/projects/${projectId}/edit`}
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          作品を編集
        </Link>
        <DeleteButton projectId={projectId} />
      </div>
    </div>
  );
}


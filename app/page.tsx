export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          作品一覧
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          みんなの編み物作品を見て、一緒に編もう
        </p>
      </div>

      {/* 作品一覧エリア（後で実装） */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            作品が登録されるとここに表示されます
          </p>
        </div>
      </div>
    </div>
  );
}

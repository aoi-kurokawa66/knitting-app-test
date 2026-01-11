"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CompletedImageInput from "../components/CompletedImageInput";
import PatternInput from "../components/PatternInput";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    yarn_color_count: "0",
    category: "" as "かぎ針" | "ぼう針" | "",
  });
  const [completedImages, setCompletedImages] = useState<string[]>([]);
  const [patternImages, setPatternImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          yarn_color_count: parseInt(formData.yarn_color_count, 10),
          completed_images: completedImages,
          pattern_images: patternImages,
          category: formData.category || null,
        }),
      });

      if (!response.ok) {
        throw new Error("作品の登録に失敗しました");
      }

      const data = await response.json();
      router.push(`/projects/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("作品の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPatternImage = () => {
    setPatternImages([...patternImages, ""]);
  };

  const updatePatternImage = (index: number, value: string) => {
    const updated = [...patternImages];
    updated[index] = value;
    setPatternImages(updated);
  };

  const removePatternImage = (index: number) => {
    setPatternImages(patternImages.filter((_, i) => i !== index));
  };

  const addCompletedImage = () => {
    setCompletedImages([...completedImages, ""]);
  };

  const updateCompletedImage = (index: number, value: string) => {
    const updated = [...completedImages];
    updated[index] = value;
    setCompletedImages(updated);
  };

  const removeCompletedImage = (index: number) => {
    setCompletedImages(completedImages.filter((_, i) => i !== index));
  };

  const moveCompletedImageUp = (index: number) => {
    if (index === 0) return;
    const updated = [...completedImages];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCompletedImages(updated);
  };

  const moveCompletedImageDown = (index: number) => {
    if (index === completedImages.length - 1) return;
    const updated = [...completedImages];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCompletedImages(updated);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 戻るボタン */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← 作品一覧に戻る
      </Link>

      {/* フォーム */}
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          作品を登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 作品タイトル */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              作品タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
              placeholder="例: かわいいマフラー"
            />
          </div>

          {/* 説明 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              説明
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
              placeholder="作品についての説明を入力してください"
            />
          </div>

          {/* 完成写真 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                完成写真
              </label>
              <button
                type="button"
                onClick={addCompletedImage}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                + 完成写真を追加
              </button>
            </div>
            {completedImages.map((imageUrl, index) => (
              <div key={`completed-${index}-${imageUrl.substring(0, 20)}`} className="mb-4">
                <CompletedImageInput
                  value={imageUrl}
                  onChange={(url) => updateCompletedImage(index, url)}
                  label={`完成写真 ${index + 1}`}
                  onRemove={() => removeCompletedImage(index)}
                  onMoveUp={() => moveCompletedImageUp(index)}
                  onMoveDown={() => moveCompletedImageDown(index)}
                  canMoveUp={index > 0}
                  canMoveDown={index < completedImages.length - 1}
                />
              </div>
            ))}
            {completedImages.length === 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                完成写真がない場合は空欄のままでもOKです
              </p>
            )}
          </div>

          {/* 編み図 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                編み図
              </label>
              <button
                type="button"
                onClick={addPatternImage}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                + 編み図を追加
              </button>
            </div>
            {patternImages.map((patternUrl, index) => (
              <div key={index} className="mb-4">
                <PatternInput
                  value={patternUrl}
                  onChange={(url) => updatePatternImage(index, url)}
                  label={`編み図 ${index + 1}`}
                  onRemove={() => removePatternImage(index)}
                />
              </div>
            ))}
            {patternImages.length === 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                編み図がない場合は空欄のままでもOKです
              </p>
            )}
          </div>

          {/* YouTube URL */}
          <div>
            <label
              htmlFor="youtube_url"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              YouTube動画のURL
            </label>
            <input
              type="url"
              id="youtube_url"
              value={formData.youtube_url}
              onChange={(e) =>
                setFormData({ ...formData, youtube_url: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              カテゴリ
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as "かぎ針" | "ぼう針" | "",
                })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
            >
              <option value="">選択してください</option>
              <option value="かぎ針">かぎ針</option>
              <option value="ぼう針">ぼう針</option>
            </select>
          </div>

          {/* 糸の色の数 */}
          <div>
            <label
              htmlFor="yarn_color_count"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              必要な糸の色の数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="yarn_color_count"
              required
              min="0"
              value={formData.yarn_color_count}
              onChange={(e) =>
                setFormData({ ...formData, yarn_color_count: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
              placeholder="例: 3"
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting ? "登録中..." : "作品を登録"}
            </button>
            <Link
              href="/"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


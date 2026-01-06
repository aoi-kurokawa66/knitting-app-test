"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, Pattern } from "../lib/db";
import ImageUpload from "./ImageUpload";
import PatternInput from "./PatternInput";

type EditProjectFormProps = {
  project: Project & { patterns?: Pattern[] };
};

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
    completed_image_url: project.completed_image_url || "",
    youtube_url: project.youtube_url || "",
    yarn_color_count: project.yarn_color_count.toString(),
  });
  const [patternImages, setPatternImages] = useState<string[]>(
    project.patterns?.map((p) => p.image_url) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          yarn_color_count: parseInt(formData.yarn_color_count, 10),
          pattern_images: patternImages,
        }),
      });

      if (!response.ok) {
        throw new Error("作品の更新に失敗しました");
      }

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("作品の更新に失敗しました");
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

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 戻るボタン */}
      <Link
        href={`/projects/${project.id}`}
        className="mb-6 inline-flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← 作品詳細に戻る
      </Link>

      {/* フォーム */}
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          作品を編集
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
          <ImageUpload
            value={formData.completed_image_url}
            onChange={(url) =>
              setFormData({ ...formData, completed_image_url: url })
            }
            label="完成写真"
          />

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
              {isSubmitting ? "更新中..." : "作品を更新"}
            </button>
            <Link
              href={`/projects/${project.id}`}
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


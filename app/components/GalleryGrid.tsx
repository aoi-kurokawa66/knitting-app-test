"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "../lib/db";

type GalleryGridProps = {
  projects: Project[];
};

export default function GalleryGrid({ projects }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "かぎ針" | "ぼう針" | "all"
  >("all");

  // 完成写真があるプロジェクトのみをフィルタリング
  let filteredProjects = projects.filter(
    (project) => project.completed_image_url
  );

  // カテゴリでフィルタリング
  if (selectedCategory !== "all") {
    filteredProjects = filteredProjects.filter(
      (project) => project.category === selectedCategory
    );
  }

  return (
    <>
      {/* カテゴリフィルター */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setSelectedCategory("かぎ針")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === "かぎ針"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          かぎ針
        </button>
        <button
          onClick={() => setSelectedCategory("ぼう針")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === "ぼう針"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          ぼう針
        </button>
      </div>

      {/* 完成写真ギャラリー */}
      {filteredProjects.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            {selectedCategory === "all"
              ? "完成写真が登録されるとここに表示されます"
              : `${selectedCategory}の完成写真がありません`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 transition-transform hover:scale-105 dark:bg-zinc-800"
            >
              <Image
                src={project.completed_image_url!}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized={project.completed_image_url!.startsWith("data:")}
              />
              {/* ホバー時にタイトルを表示 */}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-2 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="line-clamp-2 text-sm font-medium">
                    {project.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}


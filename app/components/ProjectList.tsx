"use client";

import { useState } from "react";
import type { Project } from "../lib/db";
import ProjectCard from "./ProjectCard";

type ProjectListProps = {
  projects: Project[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "かぎ針" | "ぼう針" | "all"
  >("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

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

      {/* 作品一覧 */}
      {filteredProjects.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400">
              {selectedCategory === "all"
                ? "作品が登録されるとここに表示されます"
                : `${selectedCategory}の作品がありません`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "../lib/db";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* 完成写真 */}
      {project.completed_image_url && !imageError ? (
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={project.completed_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized={project.completed_image_url.startsWith("data:")}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          <p className="text-zinc-400 dark:text-zinc-600">画像なし</p>
        </div>
      )}

      {/* 作品情報 */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {project.title}
        </h3>
        {project.description && (
          <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <span>糸の色: {project.yarn_color_count}色</span>
          {project.youtube_url && (
            <span className="flex items-center gap-1">
              <span>📺</span>
              <span>動画あり</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


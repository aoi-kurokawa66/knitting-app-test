"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  projectId: number;
};

export default function DeleteButton({ projectId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("作品の削除に失敗しました");
      }

      // 削除後にホームページにリダイレクトし、確実に最新データを取得
      router.replace("/");
      // ナビゲーション完了後にリフレッシュ
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("作品の削除に失敗しました");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "削除中..." : "削除を確定"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border border-red-300 bg-white px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/20"
    >
      作品を削除
    </button>
  );
}


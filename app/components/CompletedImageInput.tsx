"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type CompletedImageInputProps = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export default function CompletedImageInput({
  value,
  onChange,
  label,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: CompletedImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value && value.startsWith("data:image") ? value : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // valueが変更されたときにpreviewUrlを更新
  useEffect(() => {
    if (value && value.startsWith("data:image")) {
      setPreviewUrl(value);
    } else if (!value) {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画像ファイルかチェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setIsUploading(true);

    try {
      // Base64に変換
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onChange(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("画像の読み込みに失敗しました");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("画像のアップロードに失敗しました");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* 並び替えボタン */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="rounded-md p-1 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-700"
              aria-label="上に移動"
              title="上に移動"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="rounded-md p-1 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-700"
              aria-label="下に移動"
              title="下に移動"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:underline dark:text-red-400"
            >
              削除
            </button>
          )}
        </div>
      </div>

      {previewUrl ? (
        <div>
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              onChange("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="mt-2 text-sm text-red-600 hover:underline dark:text-red-400"
          >
            画像を削除
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
          />
          {isUploading && (
            <span className="text-sm text-zinc-500">アップロード中...</span>
          )}
        </div>
      )}
    </div>
  );
}

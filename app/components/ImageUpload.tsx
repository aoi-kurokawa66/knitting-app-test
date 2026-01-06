"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  preview?: boolean;
};

export default function ImageUpload({
  value,
  onChange,
  label,
  preview = true,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="mt-1">
        {preview && previewUrl ? (
          <div className="mb-2">
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
              onClick={handleRemove}
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
    </div>
  );
}


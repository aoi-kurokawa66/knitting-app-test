"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type PatternType = "image_file" | "image_url" | "pdf_file";

type PatternInputProps = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  onRemove?: () => void;
};

export default function PatternInput({
  value,
  onChange,
  label,
  onRemove,
}: PatternInputProps) {
  const [patternType, setPatternType] = useState<PatternType>(() => {
    if (!value) return "image_file";
    if (value.startsWith("data:image")) return "image_file";
    if (value.startsWith("data:application/pdf")) return "pdf_file";
    return "image_url";
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value && value.startsWith("data:image") ? value : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (patternType === "pdf_file") {
          setPreviewUrl(null);
          onChange(base64String);
        } else {
          setPreviewUrl(base64String);
          onChange(base64String);
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("ファイルの読み込みに失敗しました");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("ファイルのアップロードに失敗しました");
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    // URLタイプの場合はプレビューを表示しない
    setPreviewUrl(null);
    onChange(url);
  };

  const handleTypeChange = (type: PatternType) => {
    setPatternType(type);
    setPreviewUrl(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

      {/* タイプ選択 */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          タイプを選択
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("image_file")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              patternType === "image_file"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            画像ファイル
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("image_url")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              patternType === "image_url"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            URLリンク
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("pdf_file")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              patternType === "pdf_file"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            PDFファイル
          </button>
        </div>
      </div>

      {/* 入力フィールド */}
      {patternType === "image_file" && (
        <div>
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
            />
          )}
          {isUploading && (
            <p className="mt-2 text-sm text-zinc-500">アップロード中...</p>
          )}
        </div>
      )}

      {patternType === "image_url" && (
        <div>
          <input
            type="url"
            value={value && !value.startsWith("data:") ? value : ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
          {value && value.startsWith("http") && (
            <div className="mt-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <span>🔗</span>
                <span>リンクを開く</span>
              </a>
            </div>
          )}
        </div>
      )}

      {patternType === "pdf_file" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
          />
          {isUploading && (
            <p className="mt-2 text-sm text-zinc-500">アップロード中...</p>
          )}
          {value && value.startsWith("data:application/pdf") && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                📄 PDFファイルが選択されています
              </span>
              <button
                type="button"
                onClick={() => {
                  // Base64データをBlobに変換して新しいウィンドウで開く
                  const base64Data = value.split(",")[1];
                  const byteCharacters = atob(base64Data);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  window.open(url, "_blank");
                  // メモリリークを防ぐため、少し遅延してからURLを解放
                  setTimeout(() => URL.revokeObjectURL(url), 100);
                }}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                プレビュー
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


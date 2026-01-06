"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: Array<{ id: number; image_url: string; display_order: number }>;
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 画像のみをフィルタリング（PDFとURLリンクは除外）
  const imageItems = images.filter((item) => {
    // Base64エンコードされた画像
    if (item.image_url.startsWith("data:image")) {
      return true;
    }
    // HTTP/HTTPSのURLで、画像ファイルの拡張子があるもののみ
    if (item.image_url.startsWith("http")) {
      return item.image_url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) !== null;
    }
    return false;
  });

  if (imageItems.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < imageItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imageItems.map((item, index) => {
          const imageIndex = imageItems.findIndex((img) => img.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openModal(imageIndex)}
              className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 transition-transform hover:scale-105 dark:bg-zinc-800"
            >
              <Image
                src={item.image_url}
                alt={`編み図 ${item.display_order + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* モーダル */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* 閉じるボタン */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="閉じる"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 前の画像ボタン */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="前の画像"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* 次の画像ボタン */}
          {selectedIndex < imageItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="次の画像"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* 画像表示 */}
          <div
            className="relative max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageItems[selectedIndex].image_url}
              alt={`編み図 ${imageItems[selectedIndex].display_order + 1}`}
              width={1200}
              height={1200}
              className="max-h-[90vh] max-w-full object-contain"
              unoptimized
            />
          </div>

          {/* 画像カウンター */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
            {selectedIndex + 1} / {imageItems.length}
          </div>
        </div>
      )}
    </>
  );
}


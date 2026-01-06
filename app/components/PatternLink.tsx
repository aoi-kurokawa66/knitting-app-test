"use client";

type PatternLinkProps = {
  pattern: {
    id: number;
    image_url: string;
    display_order: number;
  };
};

export default function PatternLink({ pattern }: PatternLinkProps) {
  const isPdf = pattern.image_url.startsWith("data:application/pdf");

  const handlePdfClick = (e: React.MouseEvent) => {
    if (pattern.image_url.startsWith("data:")) {
      e.preventDefault();
      const base64Data = pattern.image_url.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
      {isPdf ? (
        <a
          href={pattern.image_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handlePdfClick}
          className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <div className="text-4xl">📄</div>
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            編み図 {pattern.display_order + 1}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            PDFファイル
          </div>
          <div className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white">
            開く
          </div>
        </a>
      ) : (
        <a
          href={pattern.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <div className="text-4xl">🔗</div>
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            編み図 {pattern.display_order + 1}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            URLリンク
          </div>
          <div className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white">
            リンクを開く
          </div>
        </a>
      )}
    </div>
  );
}


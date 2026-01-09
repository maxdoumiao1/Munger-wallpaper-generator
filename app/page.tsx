"use client";

import { useState, useRef, useEffect } from "react";
import { QUOTES_EN, QUOTES_ZH } from "@/lib/quotes";
import { renderWallpaper, loadImage } from "@/lib/render";

export default function Home() {
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  const quotes = isEnglish ? QUOTES_EN : QUOTES_ZH;
  const currentQuote = quotes[currentIndex];

  // Load background image
  useEffect(() => {
    loadImage("/bg.png")
      .then(setBackgroundImage)
      .catch(() => console.error("Failed to load background image"));
  }, []);

  const handleChooseAnother = () => {
    setGeneratedImage(null);
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleLanguageToggle = () => {
    setGeneratedImage(null);
    setIsEnglish(!isEnglish);
    setCurrentIndex(0);
  };

  const handleGenerate = async () => {
    if (!backgroundImage) return;

    setIsGenerating(true);
    try {
      const dataUrl = await renderWallpaper({
        quote: currentQuote,
        isEnglish,
        backgroundImage,
      });
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.download = "wallpaper.png";
    link.href = generatedImage;
    link.click();
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Toggle - Hidden but functional */}
        <div className="flex justify-end">
          <button
            onClick={handleLanguageToggle}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors opacity-30 hover:opacity-100"
          >
            {isEnglish ? "中文" : "EN"}
          </button>
        </div>

        {/* Preview or Generated Image */}
        {generatedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-[1170/2532] bg-black rounded-lg overflow-hidden shadow-2xl">
              <img
                src={generatedImage}
                alt="Generated wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-zinc-400 text-center">
              {isEnglish ? "Long-press to save" : "长按保存"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-3 px-6 rounded transition-colors"
              >
                Download
              </button>
              <button
                onClick={handleChooseAnother}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-3 px-6 rounded transition-colors"
              >
                Choose another
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div
              ref={previewRef}
              className="relative aspect-[1170/2532] bg-black rounded-lg overflow-hidden shadow-2xl"
              style={{
                backgroundImage: "url(/bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <p
                  className="text-center max-w-[70%]"
                  style={{
                    color: "#F0EAD6",
                    fontFamily: isEnglish
                      ? "'Times New Roman', Georgia, serif"
                      : "'SimSun', 'Source Han Serif SC', serif",
                    fontSize: isEnglish ? "1.75rem" : "1.875rem",
                    lineHeight: "1.6",
                    marginTop: "30%",
                  }}
                >
                  {currentQuote}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleChooseAnother}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-3 px-6 rounded transition-colors"
              >
                Choose another
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !backgroundImage}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate PNG"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

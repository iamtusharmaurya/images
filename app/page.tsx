"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSearchIcon } from "@/components/search-icon";

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string | null;
  user: {
    name: string;
  };
  links: {
    download: string;
  };
  width: number;
  height: number;
}

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSearchTerm, setCurrentSearchTerm] =
    useState("waterfall nature");

  useEffect(() => {
    loadDefaultImages();
  }, []);

  const accessKey = "_n3vbojk4sHcWjHOxlfrrdr1FVshQ-b6j7ZTBUvi5o8";

  const loadDefaultImages = async () => {
    setLoading(true);
    setCurrentSearchTerm("waterfall nature");

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=waterfall nature 4k high resolution&client_id=${accessKey}&per_page=12&order_by=popular&orientation=landscape&page=1`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const highResImages =
        data.results?.filter((img: any) => img.width >= 3840) || [];
      const allImages = data.results || [];
      const prioritizedImages = [
        ...highResImages,
        ...allImages.filter((img: any) => img.width < 3840),
      ].slice(0, 12);

      setImages(prioritizedImages);
      setTotalPages(Math.ceil(data.total / 12));
      setSearchPerformed(true);
    } catch (err) {
      console.error("Failed to load default images:", err);
      setImages([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearchPerformed(true);
    setPage(1);

    try {
      const searchQuery = `${query} 4k high resolution`;
      setCurrentSearchTerm(query.trim());
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&client_id=${accessKey}&per_page=12&order_by=popular&orientation=landscape&page=1`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const highResImages =
        data.results?.filter((img: any) => img.width >= 3840) || [];
      const allImages = data.results || [];
      const prioritizedImages = [
        ...highResImages,
        ...allImages.filter((img: any) => img.width < 3840),
      ].slice(0, 12);

      setImages(prioritizedImages);
      setTotalPages(Math.ceil(data.total / 12));
    } catch (err) {
      console.error("Search failed:", err);
      setImages([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const loadPage = async (pageNum: number) => {
    if (pageNum < 1) return;

    const baseQuery = currentSearchTerm || "waterfall nature";
    const searchQuery = `${baseQuery} 4k high resolution`;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&client_id=${accessKey}&per_page=12&order_by=popular&orientation=landscape&page=${pageNum}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const highResImages =
        data.results?.filter((img: any) => img.width >= 3840) || [];
      const allImages = data.results || [];
      const prioritizedImages = [
        ...highResImages,
        ...allImages.filter((img: any) => img.width < 3840),
      ].slice(0, 12);

      setImages(prioritizedImages);
      setPage(pageNum);
    } catch (err) {
      console.error("Load page failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevPage = () => page > 1 && loadPage(page - 1);
  const goToNextPage = () => page < totalPages && loadPage(page + 1);

  const handleDownload = async (image: UnsplashImage) => {
    try {
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `unsplash-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-300 via-purple-300 to-indigo-400">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Image Searcher
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-lg">
              <Input
                type="text"
                placeholder="Search Keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 text-gray-700"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                style={{ textTransform: "none" }}
              />
              <Button
                type="submit"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                <CustomSearchIcon className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {searchPerformed && (
          <>
            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.length > 0
                  ? images.map((image) => (
                      <div
                        key={image.id}
                        className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={image.urls.regular || "/placeholder.svg"}
                            alt={image.alt_description || "Unsplash image"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <button
                            onClick={() => handleDownload(image)}
                            className="absolute bottom-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
                            aria-label="Download image"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  : !loading && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-white text-lg">
                          No images found for "{currentSearchTerm}". Try a
                          different search term.
                        </p>
                      </div>
                    )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Prev
                </Button>

                <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-white/30">
                  <span className="text-gray-800 font-semibold text-lg min-w-[2rem] text-center">
                    {page}
                  </span>
                </div>

                <Button
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 text-white text-center py-4 mt-12 border-t-2 border-white/40">
        <p className="text-sm">
          © 2025{" "}
          <a
            href="https://github.com/iamtusharmaurya"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-white/90 transition-colors"
          >
            @iamtusharmaurya
          </a>{" "}
          ❤️
        </p>
      </footer>
    </div>
  );
}

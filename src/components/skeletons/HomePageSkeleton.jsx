import React from "react";
import PlaylistCardSkeleton from "./PlaylistCardSkeleton";
import MasterClassCardSkeleton from "./MasterClassCardSkeleton";
import BlogsCardSkeleton from "./BlogsCardSkeleton";
import NewsCardSkeleton from "./NewsCardSkeleton";
import BaseSkeleton from "./BaseSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Home page skeleton - matches Home.jsx layout
 */
const HomePageSkeleton = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col gap-1 overflow-x-hidden">
      {/* Hero Section Skeleton */}
      <section className="relative flex items-center px-4 md:px-16 py-12 md:py-24 w-full h-[62vh] md:h-[75vh]">
        <BaseSkeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 w-full max-w-2xl flex flex-col justify-end md:text-left mx-auto md:mx-0 mt-52 md:mt-0">
          <TextSkeleton lines={2} width="full" height="h-12 md:h-16" gap="gap-2" className="mb-3" />
          <TextSkeleton lines={2} width="full" height="h-4 md:h-5" gap="gap-2" className="mb-6" />
          <div className="flex items-center gap-3">
            <BaseSkeleton className="w-32 h-10 rounded" />
            <BaseSkeleton className="w-24 h-10 rounded" />
          </div>
        </div>
      </section>

      {/* Continue Watching Skeleton */}
      <section className="px-4 md:px-16 py-10 bg-black">
        <TextSkeleton lines={1} width="1/4" height="h-6" className="mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Playlists Carousel Skeleton */}
      <div className="bg-black text-white px-8">
        <div className="flex justify-between items-center mb-4">
          <TextSkeleton lines={1} width="1/6" height="h-6" />
          <BaseSkeleton className="w-20 h-4 rounded" />
        </div>
        <div className="flex space-x-4 h-96 overflow-x-auto no-scrollbar lg:px-6 py-2 lg:py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Master Classes Carousel Skeleton */}
      <div className="bg-black text-white px-6">
        <div className="flex justify-between items-center mb-1">
          <TextSkeleton lines={1} width="1/6" height="h-6" />
          <BaseSkeleton className="w-20 h-4 rounded" />
        </div>
        <div className="flex space-x-4 h-96 overflow-x-auto no-scrollbar lg:px-6 py-2 lg:py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <MasterClassCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Blogs Carousel Skeleton */}
      <div className="bg-black text-white px-4">
        <div className="flex justify-between items-center bg-black mb-4">
          <TextSkeleton lines={1} width="1/6" height="h-6" />
          <BaseSkeleton className="w-20 h-4 rounded" />
        </div>
        <div className="flex space-x-4 h-96 overflow-x-auto no-scrollbar lg:px-6 py-2 lg:py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogsCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* News Carousel Skeleton */}
      <div className="bg-black text-white px-4">
        <div className="flex justify-between items-center bg-black mb-4">
          <TextSkeleton lines={1} width="1/6" height="h-6" />
          <BaseSkeleton className="w-20 h-4 rounded" />
        </div>
        <div className="flex space-x-4 h-96 overflow-x-auto no-scrollbar lg:px-6 py-2 lg:py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;


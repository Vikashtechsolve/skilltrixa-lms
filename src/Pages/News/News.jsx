import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { newsAPI } from "../../utils/api";
import NewsCardH from "../../components/Cards/NewsCardH";
import { NewsPageSkeleton, NewsCardHSkeleton } from "../../components/skeletons";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, hasNext: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await newsAPI.getNews({ page: pagination.page, limit: 10 });
        
        if (response.success) {
          // Format data to match frontend expectations
          const formattedNews = response.data.map((item) => ({
            id: item._id,
            _id: item._id,
            title: item.title,
            description: item.description,
            image: item.image,
            author: item.author,
            date: item.date ? item.date : new Date(item.createdAt).toISOString(),
            tags: item.tags || [],
            category: item.category
          }));
          
          if (pagination.page === 1) {
            setNews(formattedNews);
          } else {
            setNews((prev) => [...prev, ...formattedNews]);
          }
          
          setPagination({
            page: response.pagination.page,
            hasNext: response.pagination.hasNext,
            hasPrev: response.pagination.hasPrev
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching News:", error);
        setError(error.message || "Failed to load news");
        setLoading(false);
      }
    };

    fetchNews();
  }, [pagination.page]);

  const handleLoadMore = () => {
    if (pagination.hasNext && !loading) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleNewsClick = (newsItem) => {
    navigate(`/app/News/${newsItem._id || newsItem.id}`);
  };

  return (
    <div className="min-h-screen bg-black pb-20 pt-10">
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="font-playfair font-semibold text-[28px] leading-[100%] text-white tracking-normal">
          News
        </h2>
      </div>

      {/* News List Container */}
      <div className="px-4 md:px-0 max-w-[1110px] mx-auto space-y-6">
        {loading && news.length === 0 ? (
          <NewsPageSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No news found
          </div>
        ) : (
          <>
            {news.map((item) => (
              <NewsCardH
                key={item._id || item.id}
                data={item}
                onClick={() => handleNewsClick(item)}
              />
            ))}
            {loading && news.length > 0 && (
              <NewsCardHSkeleton />
            )}
          </>
        )}
      </div>

      {/* Load More */}
      {pagination.hasNext && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 font-poppins disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Articles"}
          </button>
        </div>
      )}
    </div>
  );
};

export default News;

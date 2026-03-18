import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogsAPI } from "../../utils/api";
import BlogsCardH from "../../components/Cards/BlogsCardH";
import { BlogsPageSkeleton, BlogsCardHSkeleton } from "../../components/skeletons";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, hasNext: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogsAPI.getBlogs({ page: pagination.page, limit: 10 });
        
        if (response.success) {
          // Format data to match frontend expectations
          const formattedBlogs = response.data.map((blog) => ({
            id: blog._id,
            _id: blog._id,
            title: blog.title,
            description: blog.description,
            image: blog.image,
            author: blog.author,
            date: blog.date ? new Date(blog.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : new Date(blog.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            tags: blog.tags || [],
            category: blog.category
          }));
          
          if (pagination.page === 1) {
            setBlogs(formattedBlogs);
          } else {
            setBlogs((prev) => [...prev, ...formattedBlogs]);
          }
          
          setPagination({
            page: response.pagination.page,
            hasNext: response.pagination.hasNext,
            hasPrev: response.pagination.hasPrev
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Extract detailed error message
        let errorMessage = "Failed to load blogs";
        if (error.message) {
          errorMessage = error.message;
        } else if (error.errors && Array.isArray(error.errors)) {
          errorMessage = error.errors.map(e => e.msg || e.message).join(", ");
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pagination.page]);

  const handleLoadMore = () => {
    if (pagination.hasNext && !loading) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleBlogClick = (blog) => {
    navigate(`/app/Blogs/${blog._id || blog.id}`);
  };

  return (
    <div className="min-h-screen bg-black pb-20 pt-10">
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="font-playfair font-semibold text-[28px] leading-[100%] text-white tracking-normal">
          Blogs
        </h2>
      </div>

      {/* Blog List Container */}
      <div className="px-4 md:px-0 max-w-[1110px] mx-auto space-y-6">
        {loading && blogs.length === 0 ? (
          <BlogsPageSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No blogs found
          </div>
        ) : (
          <>
            {blogs.map((item) => (
              <BlogsCardH
                key={item._id || item.id}
                data={item}
                onClick={() => handleBlogClick(item)}
              />
            ))}
            {loading && blogs.length > 0 && (
              <BlogsCardHSkeleton />
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

export default Blogs;

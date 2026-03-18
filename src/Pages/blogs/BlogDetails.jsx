import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogsAPI, commentsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { Plus, Check, MessageCircle, Share2 } from "lucide-react";
import Comments from "../../components/Comments";
import { BlogDetailsSkeleton } from "../../components/skeletons";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await blogsAPI.getBlogById(id);
        
        if (response.success && response.data) {
          const blogData = response.data;
          
          // Clean up content - handle escaped HTML and JSON encoding
          let cleanedContent = blogData.content || "";
          if (typeof cleanedContent === "string") {
            cleanedContent = cleanedContent.trim();
            
            // If content starts with escaped quote (\"), remove it first
            if (cleanedContent.startsWith('\\"')) {
              cleanedContent = cleanedContent.substring(2);
            }
            
            // Try to parse as JSON string first (if it's double-encoded)
            try {
              if ((cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) ||
                  (cleanedContent.startsWith('\\"') && cleanedContent.endsWith('\\"'))) {
                const parsed = JSON.parse(cleanedContent);
                if (typeof parsed === "string") {
                  cleanedContent = parsed;
                }
              }
            } catch (e) {
              // Not valid JSON, continue with manual cleaning
            }
            
            // Remove leading/trailing quotes if still present (multiple layers)
            cleanedContent = cleanedContent.trim();
            let previousLength = 0;
            while (cleanedContent.length !== previousLength) {
              previousLength = cleanedContent.length;
              if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
                cleanedContent = cleanedContent.slice(1, -1).trim();
              } else if (cleanedContent.startsWith("'") && cleanedContent.endsWith("'")) {
                cleanedContent = cleanedContent.slice(1, -1).trim();
              } else if (cleanedContent.startsWith('\\"') && cleanedContent.endsWith('\\"')) {
                cleanedContent = cleanedContent.slice(2, -2).trim();
              } else {
                break;
              }
            }
            
            // Unescape common escape sequences (do this multiple times to handle double-escaping)
            for (let i = 0; i < 3; i++) {
              cleanedContent = cleanedContent
                .replace(/\\"/g, '"')      // \" -> "
                .replace(/\\'/g, "'")       // \' -> '
                .replace(/\\n/g, '\n')     // \n -> newline
                .replace(/\\t/g, '\t')      // \t -> tab
                .replace(/\\r/g, '\r')      // \r -> carriage return
                .replace(/\\\\/g, '\\');   // \\ -> \
            }
          }
          
          setBlog({
            ...blogData,
            id: blogData._id,
            content: cleanedContent,
            date: blogData.date 
              ? new Date(blogData.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : new Date(blogData.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
          });
          
          // Check if user is in watchlist
          if (isAuthenticated && user?._id) {
            const isInWatchlist = blogData.watchlistUsers?.some(
              (userId) => userId.toString() === user._id.toString()
            );
            setInWishlist(isInWatchlist || false);
          }
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, isAuthenticated, user]);

  const handleBack = () => {
    navigate("/app/Blogs");
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show message
      return;
    }

    try {
      const response = await blogsAPI.toggleWatchlist(id);
      if (response.success) {
        setInWishlist(response.data.isInWatchlist);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 animate-fade-in">
      {/* Back Navigation */}
      <div className="max-w-[1110px] mx-auto px-4 pt-6 mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors group font-poppins"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Blogs
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-[1110px] mx-auto px-4">
        {/* 1. Top Image */}
        {blog.image && (
          <div className="w-full h-[250px] md:h-[420px] rounded-[12px] overflow-hidden mb-[28px]">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* 2. Title */}
        <h1 className="font-roboto font-semibold text-[22px] md:text-[26px] leading-[1.2] md:leading-[24px] text-white mb-6 text-left">
          {blog.title}
        </h1>

        {/* 3. Description & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#333] pb-8">
          {/* LEFT: Description */}
          <p className="font-poppins font-medium text-[14px] leading-[24px] text-[#B3B3B3] md:max-w-[760px] text-left">
            {blog.description}
          </p>

          {/* RIGHT: Actions (Watchlist, Comment, Share) */}
          <div className="flex items-center gap-4 self-start">
            {/* Watchlist Button */}
            <button
              onClick={handleWatchlistToggle}
              disabled={!isAuthenticated}
              className={`
                  h-[36px] px-4 rounded-[8px] flex items-center gap-2 transition-colors
                  ${
                    inWishlist
                      ? "bg-vts-red text-white"
                      : "bg-[#2A2A2A] text-gray-300 hover:bg-[#333] hover:text-white"
                  }
                  ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
              {inWishlist ? <Check size={16} /> : <Plus size={16} />}
              <span className="text-[12px] font-poppins font-medium">
                Watchlist
              </span>
            </button>

            {/* Icons */}
            <div className="flex items-center gap-3 text-gray-400">
              <button className="p-2 hover:text-white transition-colors bg-[#2A2A2A] rounded-[8px] hover:bg-[#333]">
                <MessageCircle size={18} />
              </button>
              <button className="p-2 hover:text-white transition-colors bg-[#2A2A2A] rounded-[8px] hover:bg-[#333]">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Author & Date */}
        <div className="flex items-center gap-4 mb-12">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
              {(blog.author && blog.author.charAt(0)) || "?"}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-[14px] font-poppins">
            <span className="text-white font-semibold">{blog.author || "Unknown Author"}</span>
            {blog.date && (
              <>
                <span className="hidden md:inline text-gray-600">•</span>
                <span className="text-gray-500">{blog.date}</span>
              </>
            )}
          </div>
        </div>

        {/* 5. Main Content */}
        {blog.content && (
          <div className="font-roboto font-normal text-[16px] leading-[26px] text-[#E0E0E0] mb-20 space-y-6 text-left">
            <div 
              dangerouslySetInnerHTML={{ __html: blog.content }} 
              className="blog-content"
              style={{
                color: '#E0E0E0',
                lineHeight: '26px'
              }}
            />
            <style>{`
              .blog-content {
                color: #E0E0E0 !important;
              }
              .blog-content * {
                color: inherit;
              }
              .blog-content p {
                margin-bottom: 1rem;
                color: #E0E0E0;
              }
              .blog-content h1,
              .blog-content h2,
              .blog-content h3,
              .blog-content h4,
              .blog-content h5,
              .blog-content h6 {
                color: #ffffff;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                font-weight: 600;
              }
              .blog-content code {
                background-color: #2A2A2A;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                color: #E0E0E0;
              }
              .blog-content ul,
              .blog-content ol {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
              }
              .blog-content li {
                margin-bottom: 0.5rem;
                color: #E0E0E0;
              }
            `}</style>
          </div>
        )}
        
        {/* Tags and Category */}
        {(blog.tags?.length > 0 || blog.category) && (
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {blog.category && (
              <span className="px-3 py-1 bg-[#2A2A2A] text-gray-300 rounded-[6px] text-[12px] font-poppins font-medium">
                {blog.category}
              </span>
            )}
            {blog.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-[#2A2A2A] text-gray-400 rounded-[6px] text-[12px] font-poppins font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 6. Comments Section */}
        <Comments 
          contentType="blog"
          contentId={id}
        />
      </div>
    </div>
  );
};

export default BlogDetails;

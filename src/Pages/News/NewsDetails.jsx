import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { newsAPI, commentsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import { Plus, Check, MessageCircle, Share2 } from "lucide-react";
import TimeAgo from "./components/Timeago";
import Comments from "../../components/Comments";
import FormatDate from "./components/FormatDate";
import { NewsDetailsSkeleton } from "../../components/skeletons";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getNewsById(id);
        
        if (response.success && response.data) {
          const newsData = response.data;
          
          // Clean up content - handle escaped HTML and JSON encoding
          let cleanedContent = newsData.content || "";
          if (typeof cleanedContent === "string") {
            cleanedContent = cleanedContent.trim();
            
            // If content starts with escaped quote (\"), remove it first
            if (cleanedContent.startsWith('\\"')) {
              cleanedContent = cleanedContent.substring(2);
            }
            
            // Try to parse as JSON string first (if it's double-encoded)
            try {
              // If it looks like a JSON-encoded string, try parsing
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
            
            // Log for debugging
            console.log("Original content preview:", newsData.content?.substring(0, 100));
            console.log("Cleaned content preview:", cleanedContent.substring(0, 100));
          }
          
          setNews({
            ...newsData,
            id: newsData._id,
            content: cleanedContent,
            date: newsData.date || newsData.createdAt
          });
          
          // Check if user is in watchlist
          if (isAuthenticated && user?._id) {
            const isInWatchlist = newsData.watchlistUsers?.some(
              (userId) => userId.toString() === user._id.toString()
            );
            setInWishlist(isInWatchlist || false);
          }
        } else {
          console.error("News not found");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id, isAuthenticated, user]);

  const handleBack = () => {
    navigate("/app/News");
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show message
      return;
    }

    try {
      const response = await newsAPI.toggleWatchlist(id);
      if (response.success) {
        setInWishlist(response.data.isInWatchlist);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  if (loading) {
    return <NewsDetailsSkeleton />;
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">News not found</div>
      </div>
    );
  }

  // Format date properly - handle both ISO strings and Date objects
  const newsDate = news.date || news.createdAt;
  const timeAgo = newsDate ? TimeAgo(newsDate) : "";
  const date = newsDate ? FormatDate(newsDate) : "";

  return (
    <div className="min-h-screen bg-black text-white pb-20 animate-fade-in">
      {/* Back Navigation */}
      <div className="max-w-[1110px] mx-auto px-4 pt-6 mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors group font-poppins"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to News
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-[1110px] mx-auto px-4">
        {/* 1. Top Image */}
        {news.image && (
          <div className="w-full h-[250px] md:h-[420px] rounded-[12px] overflow-hidden mb-[28px]">
            <img
              src={news.image}
              alt={news.title || "News image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* 2. Title */}
        <h1 className="font-roboto font-semibold text-[22px] md:text-[26px] leading-[1.2] md:leading-[24px] text-white mb-6 text-left">
          {news.title}
        </h1>

        {/* 3. Description & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#333] pb-8">
          {/* LEFT: Description */}
          <p className="font-poppins font-medium text-[14px] leading-[24px] text-[#B3B3B3] md:max-w-[760px] text-left">
            {news.description}
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
              {(news.author && news.author.charAt(0)) || "?"}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-[14px] font-poppins">
            <span className="text-white font-semibold">{news.author || "Unknown Author"}</span>
            {date && (
              <>
            <span className="hidden md:inline text-gray-600">•</span>
            <span className="text-gray-500">{date}</span>
              </>
            )}
            {timeAgo && (
              <>
                <span className="hidden md:inline text-gray-600">•</span>
            <span className="text-gray-500">{timeAgo}</span>
              </>
            )}
          </div>
        </div>

        {/* 5. Main Content */}
        {news.content && (
          <div className="font-roboto font-normal text-[16px] leading-[26px] text-[#E0E0E0] mb-20 space-y-6 text-left">
            {/* Try to render as HTML first */}
            {news.content.includes('<') && news.content.includes('>') ? (
              <div 
                dangerouslySetInnerHTML={{ __html: news.content }} 
                className="news-content prose prose-invert max-w-none"
                style={{
                  color: '#E0E0E0',
                  lineHeight: '26px'
                }}
              />
            ) : (
              /* Fallback: Show as plain text if no HTML tags */
              <div className="whitespace-pre-wrap text-[#E0E0E0]">{news.content}</div>
            )}
            <style>{`
              .news-content {
                color: #E0E0E0 !important;
              }
              .news-content * {
                color: inherit;
              }
              .news-content p {
                margin-bottom: 1rem;
                color: #E0E0E0;
              }
              .news-content h1,
              .news-content h2,
              .news-content h3,
              .news-content h4,
              .news-content h5,
              .news-content h6 {
                color: #ffffff;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                font-weight: 600;
              }
              .news-content code {
                background-color: #2A2A2A;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                color: #E0E0E0;
              }
              .news-content ul,
              .news-content ol {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
              }
              .news-content li {
                margin-bottom: 0.5rem;
                color: #E0E0E0;
              }
              .news-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 1rem 0;
              }
            `}</style>
          </div>
        )}
        
        {/* Tags and Category */}
        {(news.tags?.length > 0 || news.category) && (
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {news.category && (
              <span className="px-3 py-1 bg-[#2A2A2A] text-gray-300 rounded-[6px] text-[12px] font-poppins font-medium">
                {news.category}
              </span>
            )}
            {news.tags?.map((tag, index) => (
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
          contentType="news"
          contentId={id}
        />
      </div>
    </div>
  );
};

export default NewsDetails;

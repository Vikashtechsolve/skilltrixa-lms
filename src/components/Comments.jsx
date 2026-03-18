import React, { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { commentsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import FormatDate from "../Pages/News/components/FormatDate";

const Comments = ({ 
  contentType, 
  contentId
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch comments when contentId changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!contentId || !contentType) {
        setComments([]);
        return;
      }
      
      try {
        setLoading(true);
        const response = await commentsAPI.getComments(contentType, contentId);
        if (response.success && response.data) {
          // Format comments to match frontend expectations
          const formattedComments = response.data.map((comment) => ({
            id: comment._id,
            _id: comment._id,
            author: comment.authorName,
            avatar: comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`,
            text: comment.text,
            date: comment.date 
              ? FormatDate(comment.date)
              : comment.createdAt 
                ? FormatDate(comment.createdAt)
                : FormatDate(new Date().toISOString()),
            isInput: false
          }));
          setComments(formattedComments);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentId, contentType]);

  const commentCount = comments.filter((c) => !c.isInput).length;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      alert("Please login to comment");
      return;
    }
    if (!contentType || !contentId) {
      console.error("contentType and contentId are required");
      return;
    }

    try {
      setSubmitting(true);
      const response = await commentsAPI.createComment({
        contentId,
        contentType,
        authorId: user?._id,
        authorName: user?.name || "Anonymous",
        avatar: user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Anonymous")}`,
        text: newComment.trim()
      });

      if (response.success && response.data) {
        // Clear input immediately for better UX
        setNewComment("");
        
        // Refetch all comments to ensure we have the latest from database
        const refreshResponse = await commentsAPI.getComments(contentType, contentId);
        if (refreshResponse.success && refreshResponse.data) {
          const formattedComments = refreshResponse.data.map((comment) => ({
            id: comment._id,
            _id: comment._id,
            author: comment.authorName,
            avatar: comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`,
            text: comment.text,
            date: comment.date 
              ? FormatDate(comment.date)
              : comment.createdAt 
                ? FormatDate(comment.createdAt)
                : FormatDate(new Date().toISOString()),
            isInput: false
          }));
          
          setComments(formattedComments);
        } else {
          // If refetch fails, still add the comment optimistically
          const newCommentObj = {
            id: response.data._id,
            _id: response.data._id,
            author: response.data.authorName,
            avatar: response.data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.authorName)}`,
            text: response.data.text,
            date: response.data.date 
              ? FormatDate(response.data.date)
              : response.data.createdAt 
                ? FormatDate(response.data.createdAt)
                : FormatDate(new Date().toISOString()),
            isInput: false
          };
          setComments([newCommentObj, ...comments]);
        }
      } else {
        throw new Error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  return (
    <div className="mt-20 text-left">
      <h3 className="font-roboto font-semibold text-[24px] text-white mb-8 text-left">
        Comments ({commentCount})
      </h3>

      <div className="space-y-6">
        {/* Input Section */}
        {isAuthenticated ? (
          <div className="flex gap-4 text-left">
            <div className="flex-shrink-0">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`}
                alt={user?.name || "You"}
                className="w-[44px] h-[44px] rounded-full object-cover border border-gray-700"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts?"
                disabled={submitting}
                className="w-full bg-[#1E1E1E] text-gray-300 text-[14px] font-poppins p-4 pr-12 rounded-[12px] border border-transparent focus:border-gray-600 outline-none transition-colors text-left disabled:opacity-50"
              />
              <button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            Please login to comment
          </div>
        )}

        {/* Comment List */}
        {loading && comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(
            (comment) =>
              !comment.isInput && (
                <div key={comment.id || comment._id} className="flex gap-4 text-left">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-[44px] h-[44px] rounded-full object-cover border border-gray-700"
                  />
                </div>

                {/* Body */}
                <div className="flex-1 text-left">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h4 className="text-white font-poppins font-medium text-[14px]">
                      {comment.author}
                    </h4>
                    {comment.date && (
                      <span className="text-gray-500 text-[12px]">
                        {comment.date}
                      </span>
                    )}
                  </div>
                  <div className="bg-[#1E1E1E] p-4 rounded-[12px] text-[#B3B3B3] text-[14px] font-poppins font-medium leading-[24px] text-left">
                    {comment.text}
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default Comments;

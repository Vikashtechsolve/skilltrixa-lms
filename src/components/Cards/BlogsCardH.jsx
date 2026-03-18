import React, { useState } from "react";
import { Plus, Check, MessageCircle, Share2 } from "lucide-react";

const BlogsCardH = ({ data, onClick }) => {
  const [inWishlist, setInWishlist] = useState(false);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setInWishlist(!inWishlist);
    console.log(
      `${inWishlist ? "Removed from" : "Added to"} wishlist: ${data.title}`
    );
  };

  return (
    <div
      onClick={onClick}
      className="
        bg-[#1F1F1F] rounded-[12px] overflow-hidden
        hover:border hover:border-gray-700 transition-all duration-300
        flex flex-col-reverse md:flex-row cursor-pointer relative group mx-auto
        w-full max-w-[380px] md:max-w-[1110px]
      "
    >
      <div className="flex-1 p-[10px] md:p-[28px] flex flex-col relative text-left">
        {/* TITLE ROW (Mobile: Title + Button) */}
        <div className="flex justify-between items-start mb-2 md:mb-[14px]">
          {/* Title: Roboto, Mobile 16px SemiBold, Desktop 26px */}
          <h3 className="font-roboto font-semibold text-[16px] md:text-[26px] leading-[24px] text-white text-left flex-1 pr-2">
            {data.title}
          </h3>

          {/* Mobile Watchlist Button (Hidden on Desktop) */}
          <button
            onClick={handleWishlistToggle}
            className={`
              md:hidden
              w-[80px] h-[32px] rounded-[8px] bg-[#696969]
              flex items-center justify-center gap-1 flex-shrink-0
              text-white text-[10px] font-poppins font-medium
              hover:bg-gray-500 transition-colors
            `}
          >
            {inWishlist ? <Check size={12} /> : <Plus size={12} />}
            <span>Watchlist</span>
          </button>
        </div>

        {/* Description: Poppins, Mobile 12px Medium #B3B3B3, Desktop 14px */}
        <p className="font-poppins font-medium text-[12px] md:text-[14px] leading-[20px] md:leading-[24px] text-[#B3B3B3] mb-4 md:mb-[52px] max-w-[756px] line-clamp-3 md:line-clamp-2 text-left">
          {data.description}
        </p>

        {/* Bottom Row: Meta + Icons + Desktop Button */}
        <div className="flex items-center justify-between mt-auto w-full">
          {/* Meta Info & Icons */}
          <div className="flex items-center flex-wrap gap-[8px] md:gap-4 text-gray-400 font-poppins text-left">
            {/* Published By */}
            <div className="flex items-center gap-1 text-[10px] md:text-[14px] leading-[20px]">
              <span className="font-normal opacity-70">Published by:</span>
              {/* Mobile: SemiBold (600), Desktop: Medium */}
              <span className="text-white font-semibold md:font-medium">
                {data.author}
              </span>
            </div>

            {/* Date: Mobile 10px Regular (400) */}
            <span className="text-[10px] md:text-[14px] leading-[20px] font-normal md:font-normal text-gray-400 md:text-gray-500">
              {data.date}
            </span>

            {/* Icons (Comment & Share) */}
            <div className="flex items-center gap-3 ml-1 md:ml-2">
              <button
                className="hover:text-white transition-colors flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={16} className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                className="hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 size={16} className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Wishlist Button (Hidden on Mobile) */}
          <button
            onClick={handleWishlistToggle}
            className={`
              hidden md:flex
              w-10 h-10 items-center justify-center rounded-lg transition-all duration-200 ml-4 flex-shrink-0
              ${
                inWishlist
                  ? "bg-vts-red text-white"
                  : "bg-[#2A2A2A] text-gray-400 hover:bg-[#333] hover:text-white"
              }
            `}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {inWishlist ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE (Desktop) / TOP IMAGE (Mobile) */}
      {/* Mobile: No padding (full width top), Desktop: 14px padding */}
      <div className="p-0 md:p-[14px] flex-shrink-0">
        <div className="w-full md:w-[268px] h-[150px] md:h-[172px] rounded-t-[12px] md:rounded-[12px] overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogsCardH;

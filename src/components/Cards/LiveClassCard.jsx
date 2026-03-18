import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const LiveClassCard = ({ ite }) => {
  return (
    <Link to={`/master-class/${item.id}`} className="block w-full">
      <div className="rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute left-3 bottom-3 bg-zinc-800 text-white text-sm px-3 py-1 rounded flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span>{item.badge || "Live Class - Available Soon"}</span>
          </div>
        </div>

        <div className="p-3">
          <p className="text-sm text-zinc-200 font-semibold leading-snug">{item.title}</p>
          <div className="mt-2 text-xs text-zinc-400 flex items-center gap-2">
            <span>{item.category}</span>
            <span>•</span>
            <span>{item.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LiveClassCard;

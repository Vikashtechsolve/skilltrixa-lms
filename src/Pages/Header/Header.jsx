import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#0F0F0F]  h-20 flex items-center  justify-between px-3 lg:px-12">
      
      {/* LOGO — Mobile pe RIGHT me shift, large screens pe LEFT */}
      <div
        className="flex cursor-pointer ml-54 md:ml-0" 
        onClick={() => navigate("/app")}
      >
        <img src="/logo.svg" className="w-35" alt="Skilltrixa" />
      </div>

      {/* PROFILE BUTTON — Mobile pe HIDE, md+ pe show */}
      <div className="hidden md:flex items-center gap-6 order-3">
        <button
          onClick={() => navigate("/app/profile")}
          className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition text-white"
          aria-label="Go to profile"
        >
          <User size={20} />
        </button>
      </div>

    </header>
  );
}

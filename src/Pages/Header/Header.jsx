import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#0F0F0F] h-20 flex items-center justify-between px-3 lg:px-12">
      
      {/* LOGO */}
      <div
        className="flex cursor-pointer" 
        onClick={() => navigate("/app")}
      >
        <div className="rounded-lg bg-white px-3 py-1.5 shadow-sm">
          <img 
            src="/logo.svg" 
            alt="Skilltrixa" 
            className="h-8 w-auto object-contain md:h-9"
            width={180}
            height={36}
          />
        </div>
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

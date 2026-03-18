import { Award } from "lucide-react";
import Sidebar from "./ProfileSidebar";
import Header from "../Header/Header";

const ProfileBadges = () => {
  return (
    <>
     <div className="fixed top-0 left-0 w-full z-40">
  <Header />
</div>

    <div className="flex flex-col md:flex-row bg-[#141414] text-white min-h-screen pt-16">
      {/* Sidebar (full width on mobile, regular on desktop) */}
     <div className="mt-0 px-0 md:mt-8 md:px-12">
                   <Sidebar />
                 </div>

      {/* Main Section */}
      <div className="flex-1 px-5 sm:px-8 md:px-10 py-8">

        <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-semibold mb-8 md:mb-10 text-left">
          Profile
        </h1>

        {/* Title */}
        <div className="flex items-center gap-2 mb-8">
          <Award className="text-white w-5 h-5" />
          <h1 className="text-xl sm:text-2xl font-semibold">Badges</h1>
        </div>

        {/* Card */}
        <div className="
          bg-[#161616]
          border border-[#242424]
          rounded-xl
          p-6 sm:p-10
          flex flex-col items-center justify-center
          text-center
          min-h-[250px] sm:min-h-[300px]
          w-full md:w-1/2
          mx-auto
        ">
          <p className="text-lg font-medium mb-3">No Badges Earned Yet</p>

          <p className="text-sm font-medium text-[#E0E0E0] leading-6 max-w-[420px]">
            Start learning and complete activities to earn badges.
          </p>
        </div>
      </div>

    </div>
          </>
  );
};

export default ProfileBadges;

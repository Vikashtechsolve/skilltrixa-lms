import React, { useState, useEffect } from "react";
import Sidebar from "./ProfileSidebar";

import {
  BookOpenCheck,
  ListMusic,
  GraduationCap,
  Award,
  CheckCircle,
  Layers,
} from "lucide-react";
import Header from "../Header/Header";
import { ProfileProgressSkeleton } from "../../components/skeletons";
import { progressAPI } from "../../utils/api";

export default function StudentProgress() {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    overallProgress: { percent: 0, description: "" },
    modulesCompleted: { count: 0, description: "" },
    masterClassesAttended: { count: 0, lastAttended: null },
    quizAttempts: { count: 0, lastAttempt: null },
    badgesEarned: { count: 0 },
  });

  useEffect(() => {
    const fetchProgressSummary = async () => {
      try {
        setLoading(true);
        const response = await progressAPI.getProgressSummary();
        if (response.success && response.data) {
          setProgressData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch progress summary:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchProgressSummary();
  }, []);

  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-40">
          <Header />
        </div>

        <div className="flex bg-[#141414] pt-16 min-h-screen text-left">
          <div className="mt-0 px-0 md:mt-8 md:px-12">
            <Sidebar />
          </div>

          <div className="flex-1 text-white px-6 py-8">
            <h1 className="text-[34px] font-semibold mb-6">Profile</h1>
            <div className="flex items-center gap-3 mb-1">
              <GraduationCap size={22} className="text-gray-200" />
              <h1 className="text-[22px] font-semibold">Student Progress</h1>
            </div>
            <p className="text-gray-400 text-[14px] mb-8">
              Track your course completion, quiz performance, and overall learning
              milestones
            </p>
            <ProfileProgressSkeleton />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex bg-[#141414] pt-16 min-h-screen text-left">
        {/* Sidebar */}
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 text-white px-6 py-8">
          {/* <h1 className="text-[40px] font-semibold mb-10 text-left">Profile</h1> */}

          {/* Profile Heading */}
          <h1 className="text-[34px] font-semibold mb-6">Profile</h1>

          {/* Student Progress Heading */}
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap size={22} className="text-gray-200" />
            <h1 className="text-[22px] font-semibold">Student Progress</h1>
          </div>
          <p className="text-gray-400 text-[14px] mb-8">
            Track your course completion, quiz performance, and overall learning
            milestones
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ALL COURSES PROGRESS */}
            <div className="bg-[#141414] p-5 rounded-xl shadow border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BookOpenCheck className="text-gray-300" size={22} />
                <h2 className="text-[17px] font-medium">
                  All Courses Progress
                </h2>
              </div>

              <p className="text-gray-300 text-[14px] mb-2">
                Your Progress Bar : {progressData.overallProgress.percent}%
              </p>

              <div className="w-full bg-gray-700 h-3 rounded-full">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${progressData.overallProgress.percent}%` }}
                ></div>
              </div>

              <p className="text-gray-400 text-[13px] mt-3">
                {progressData.overallProgress.description}
              </p>
            </div>

            {/* PLAYLIST */}
            <div className="bg-[#141414] p-5 rounded-xl shadow border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ListMusic className="text-gray-300" size={22} />
                <h2 className="text-[17px] font-medium">Playlist</h2>
              </div>

              <h1 className="text-[22px] font-semibold mb-1">
                {progressData.modulesCompleted.count} Modules Completed
              </h1>
              <p className="text-gray-400 text-[13px]">
                {progressData.modulesCompleted.description}
              </p>
            </div>

            {/* MASTER CLASSES */}
            <div className="bg-[#141414] p-5 rounded-xl shadow border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="text-gray-300" size={22} />
                <h2 className="text-[17px] font-medium">
                  Master Classes Attended
                </h2>
              </div>

              <h1 className="text-[22px] font-semibold mb-1">
                {progressData.masterClassesAttended.count} Master Classes Done
              </h1>
              <p className="text-gray-400 text-[13px]">
                {progressData.masterClassesAttended.lastAttended
                  ? `Last Master Class : ${progressData.masterClassesAttended.lastAttended}`
                  : "No master classes attended yet"}
              </p>
            </div>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* QUIZZES */}
            <div className="bg-[#141414] p-5 rounded-xl shadow border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-gray-300" size={22} />
                <h2 className="text-[17px] font-medium">
                  Total Quizzes Attempt
                </h2>
              </div>

              <h1 className="text-[22px] font-semibold mb-1">
                {progressData.quizAttempts.count} Quizzes Attempted
              </h1>
              <p className="text-gray-400 text-[13px]">
                {progressData.quizAttempts.lastAttempt
                  ? `Last Quiz : ${progressData.quizAttempts.lastAttempt}`
                  : "No quizzes attempted yet"}
              </p>
            </div>

            {/* BADGES */}
            <div className="bg-[#141414] p-5 rounded-xl shadow border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-gray-300" size={22} />
                <h2 className="text-[17px] font-medium">Badges Earned</h2>
              </div>

              <h1 className="text-[22px] font-semibold mb-1">
                {progressData.badgesEarned.count} Badges Earned
              </h1>
              <p className="text-[13px] text-gray-300 cursor-pointer hover:underline">
                View all Badges
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

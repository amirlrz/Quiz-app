'use client'

import { useQuery } from "@tanstack/react-query";
import useAuthHook from "../hooks/useAuthHook";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

export default function ShowResult() {
  const { getUserScore } = useAuthHook();
  const { category, lesson_number, lesson_season } = useSelector((state: RootState) => state.teacherFilterData);

  const { data: UsersScore } = useQuery({
    queryKey: ["getUserScore"],
    queryFn: getUserScore,
  });
  const sortedUsers = UsersScore?.slice().sort((a, b) => b.score - a.score);

  const rankStyles = [
    {
      bg: "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500",
      icon: "🥇",
      glow: "shadow-[0_0_40px_10px_rgba(255,215,0,0.7)]",
    },
    {
      bg: "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500",
      icon: "🥈",
      glow: "",
    },
    {
      bg: "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500",
      icon: "🥉",
      glow: "",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-10 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 overflow-x-hidden">
      
      <Image
        src="/7469379.jpg"
        alt="background"
        fill
        priority
        className="object-cover z-0 opacity-20"
      />
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* هدر جدول با درس، فصل و دسته‌بندی */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="z-10 flex flex-row  -mt-7  items-center gap-3 bg-white/70 backdrop-blur-md p-2 md:p-1 rounded-xl shadow-2xl text-purple-800 font-bold text-sm md:text-xl"
      >
         <Link
         className="bg-amber-100 rounded-full p-1 border border-pink-400 animate-pulse"
    href="/"
  >
    🏠  
  </Link>
        <span className="p-1 rounded-xl bg-linear-to-r from-green-200 via-lime-200 to-amber-200 shadow-md">
          📝 درس شماره {lesson_number || "-"}
        </span>
        <span className="p-1 rounded-xl bg-linear-to-r from-blue-200 via-cyan-200 to-teal-200 shadow-md">
          🌈 فصل {lesson_season || "-"}
        </span>
        <span className="p-1 rounded-xl bg-linear-to-r from-purple-200 via-pink-200 to-yellow-200 shadow-md">
          📚 {category || "نام درس"}
        </span>

</motion.div>
      <h1 className="z-10 text-4xl font-bold text-white mb-6 md:mb-8 mt-4 drop-shadow-lg text-center">
        🏆 جدول امتیازات 🏆
      </h1>


      <div className="z-10 w-full max-w-md flex flex-col gap-4 px-2 md:px-0">
        {sortedUsers?.map((u, idx) => {
          const rank = rankStyles[idx];
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.15, type: "spring" }}
              className={`
                flex justify-between items-center p-4 rounded-2xl shadow-xl font-semibold text-lg text-black relative
                ${rank ? `${rank.bg} ${rank.glow}` : "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"}
              `}
            >
              {/* تاج نفر اول */}
              {idx === 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-bounce"
                >
                  👑
                </motion.div>
              )}

              <span className="flex items-center gap-2">
                {idx + 1}. {u.username}
                {rank && <span className="text-2xl">{rank.icon}</span>}
              </span>

              <span>{u.score} امتیاز</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

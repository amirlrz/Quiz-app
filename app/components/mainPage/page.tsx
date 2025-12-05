'use client'

import useAuthHook from "@/app/hooks/useAuthHook";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import boyAnimation from "../../../public/Game Controller.json";
import Lottie from "lottie-react";
import Image from "next/image";
import useQuestionsHooks from "@/app/hooks/useQuestionsHooks";
import TeacherDashboard from "../TeacherDashboard/page";

export default function HomePage() {
  const { signOut, getCurrentUserProfile } = useAuthHook();
  const { getQuestions } = useQuestionsHooks();
  const route = useRouter();
  const { data: userdata } = useQuery({
    queryKey: ["getCurrentUserProfile"],
    queryFn: getCurrentUserProfile,
  });
  const {data } = useQuery({
    queryKey:["getdata"],
    queryFn :getQuestions
  })
//console.log("data" , data);

  const categories = Array.from(new Set(data?.map((q) => q.category) ?? []));
  const lessonNumbers = Array.from(new Set(data?.map((q) => q.lesson_number) ?? []));
  return (
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
         <Image
           src="/7469379.jpg"
           alt="background"
           fill
           priority
           className="object-cover z-0 opacity-25"
         />

<button
onClick={()=>route.push("/teacherPage")}
className={`${userdata?.email?.split("@")[0] == "ghonche" ? "fixed top-15 left-5 px-5 py-2 rounded-md bg-red-500 text-white  cursor-pointer font-bold shadow-xl text-lg" : "hidden"}`}>
طرح سوال
</button>

      {/* 🍭 دکمه خروج */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed top-3 left-5 px-5 py-2 rounded-md bg-red-500 text-white font-bold shadow-xl text-lg cursor-pointer"
        onClick={() => signOut()}
      >
        خروج 🚪
      </motion.button>
      {
        userdata?.email?.split("@")[0] == "ghonche" &&
       <TeacherDashboard  lessonNumbers={lessonNumbers} categories={categories} />
     
      }
   


      {/* 🎈 باکس اصلی */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className=" backdrop-blur-lg bottom-0 p-10 m-2 rounded-3xl shadow-2xl  text-center max-w-md z-10"
      >

        <h2 className="text-4xl font-extrabold text-purple-700 mb-4 drop-shadow-lg">
            {userdata?.email?.split("@")[0] || ""} 
        </h2>
<span className="text-2xl  font-extrabold text-purple-300 mb-6 drop-shadow-lg animate-bounce">
🎉سلام 
</span>
        <p className="text-2xl text-pink-700 font-semibold mb-8 mt-2">
          به بازی کلمات کلاس دوم خوش اومدی 
        </p>
        <p className="text-2xl text-pink-700 font-semibold mb-8">
        🤩✨
        </p>

        {/* 🎮 دکمه شروع بازی */}
        <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => route.push("/mainGamePage")}
  className="flex items-center justify-center gap-3 w-full py-1 text-xl font-bold 
           cursor-pointer   bg-linear-to-r from-purple-500 to-pink-500 
             text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all"
>
  <span>بزن بریم بازی</span>

  <div className="w-24 h-1w-24 flex items-center">
    <Lottie animationData={boyAnimation} loop={true} />
  </div>
</motion.button>

      </motion.div>
    </div>
  );
}

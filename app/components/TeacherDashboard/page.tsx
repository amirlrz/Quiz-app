'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setcategory, setlesson_number, setlesson_season } from "@/store/categorySlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { RootState } from "@/store";
import useAuthHook from "@/app/hooks/useAuthHook";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface TeacherDashboard {
    categories: string[];      
    lessonNumbers: number[];
}
interface insertExamCategory  {
    lesson_number : number
    category:string
    lesson_season:number
}

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const { category, lesson_number ,lesson_season } = useSelector((state: RootState) => state.teacherFilterData);
  const [open, setOpen] = useState(false);
const { insertExamCategory ,getCategoryDrop ,getLesson_numDrop ,getLesson_seasonDrop} =useAuthHook()
  //if (userdata?.email?.split("@")[0] !== "ghonche") return null;

const {data :lesson_field}= useQuery({
  queryKey:["getcategorydrop"],
  queryFn: getCategoryDrop
})
const {data :lesson_num}= useQuery({
  queryKey:["getlesson_numdrop"],
  queryFn: getLesson_numDrop
})
const {data :lessonseason}= useQuery({
  queryKey:["getLesson_seasonDrop"],
  queryFn: getLesson_seasonDrop
})
//console.log("drop" , lessonseason);


  const { mutate } = useMutation({
    mutationFn: ({ lesson_number, category ,lesson_season } : insertExamCategory) =>
      insertExamCategory({lesson_number, category ,lesson_season}),
    onSuccess: () => {
        toast.success(" با موفقیت انجام شد");
        setOpen(false)
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err.message || "خطا❌");
        } else {
          toast.error("خطای ناشناخته ❌");
        }
      }
  });
  
  
  return (
    <>
   
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5  right-5 z-30 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {open ? "بستن داشبورد" : "داشبورد"}
      </button>

    
      {
        open && 
        <motion.div
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl p-4 z-20 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-gray-600 mb-4">داشبورد معلم</h2>


        <FormControl fullWidth className="bg-gray-100 rounded-xl p-1">
  <InputLabel>مبحث</InputLabel>
  <Select
    value={category}
    onChange={(e) => dispatch(setcategory(e.target.value))}
  >
    {lesson_field?.map((item) => (
      <MenuItem key={item.id} value={item.category}>
        {item.category}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<FormControl fullWidth className="bg-gray-100 rounded-xl p-1">
          <InputLabel> فصل</InputLabel>
          <Select
            value={lesson_season}
            onChange={(e) => dispatch(setlesson_season(e.target.value))}
          >
 {lessonseason?.map((item) => (
      <MenuItem key={item.id} value={item.lesson_season}>
        {item.lesson_season}
      </MenuItem>
    ))}
          </Select>
        </FormControl>

        <FormControl fullWidth className="bg-gray-100 rounded-xl p-1">
          <InputLabel> درس</InputLabel>
          <Select
            value={lesson_number}
            onChange={(e) => dispatch(setlesson_number(e.target.value))}
          >
             {lesson_num?.map((item) => (
      <MenuItem key={item.id} value={item.lesson_num}>
        {item.lesson_num}
      </MenuItem>
    ))}
          </Select>
        </FormControl>

        
        <button
  onClick={() => mutate({ lesson_number, category ,lesson_season })}
  className="px-4 py-2 bg-blue-500 text-white rounded-xl"
>
  ثبت درس
</button>

      </motion.div>

      }

   
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

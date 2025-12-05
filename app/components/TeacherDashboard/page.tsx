'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setcategory, setlesson_number } from "@/store/categorySlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { RootState } from "@/store";

interface TeacherDashboard {
    categories: string[];      
    lessonNumbers: number[];
}


export default function TeacherDashboard({ categories, lessonNumbers }:TeacherDashboard) {
  const dispatch = useDispatch();
  const { category, lesson_number } = useSelector((state: RootState) => state.teacherFilterData);
  const [open, setOpen] = useState(false);

  //if (userdata?.email?.split("@")[0] !== "ghonche") return null;

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
          <InputLabel>شماره درس</InputLabel>
          <Select
            value={lesson_number}
            onChange={(e) => dispatch(setlesson_number(e.target.value))}
          >
            {lessonNumbers.map((ln) => (
              <MenuItem key={ln} value={ln}>{ln}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth className="bg-gray-100 rounded-xl p-1">
          <InputLabel>نام درس</InputLabel>
          <Select
            value={category}
            onChange={(e) => dispatch(setcategory(e.target.value))}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
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

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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const { category, lesson_number, lesson_season } = useSelector(
    (state: RootState) => state.teacherFilterData
  );

  const [open, setOpen] = useState(false);

  const {
    insertExamCategory,
    getCategoryDrop,
    getLesson_numDrop,
    getLesson_seasonDrop,
    resetAllScores,
  } = useAuthHook();

  const { data: lesson_field } = useQuery({
    queryKey: ["getcategorydrop"],
    queryFn: getCategoryDrop,
  });
  const { data: lesson_num } = useQuery({
    queryKey: ["getlesson_numdrop"],
    queryFn: getLesson_numDrop,
  });
  const { data: lessonseason } = useQuery({
    queryKey: ["getLesson_seasonDrop"],
    queryFn: getLesson_seasonDrop,
  });

  const { mutate: resetScoresMutate, isPending: deleting } = useMutation({
    mutationFn: resetAllScores,
    onSuccess: () => toast.success("امتیازات با موفقیت ریست شد 🎉"),
    onError: () => toast.error("خطا در ریست امتیازات ❌"),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => insertExamCategory({ lesson_number, category, lesson_season }),
    onSuccess: () => {
      toast.success("با موفقیت ثبت شد 🎉");
      setOpen(false);
    },
    onError: () => toast.error("خطا در ثبت اطلاعات ❌"),
  });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 right-5 z-30 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full shadow-xl transition-all"
      >
        {open ? "بستن" : "داشبورد"}
      </button>

      {/* Drawer */}
      {open && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-5 z-20 flex flex-col gap-6"
        >
          <h2 className="text-xl font-bold text-gray-700"> داشبورد معلم</h2>

          {/* انتخاب مبحث */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">📚  مبحث</label>
            <FormControl fullWidth>
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
          </div>

          {/* انتخاب فصل */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">🌈 فصل</label>
            <FormControl fullWidth>
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
          </div>

          {/* انتخاب درس */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">📝 شماره درس</label>
            <FormControl fullWidth>
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
          </div>

          {/* ثبت درس */}
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all"
          >
            <CheckCircleIcon /> {isPending ? "در حال ثبت..." : "ثبت درس"}
          </button>

          {/* خطرناک — ریست امتیازات */}
          <div className="border-t pt-4">
            <p className="text-gray-700 flex items-center gap-2">
              <WarningAmberIcon className="text-yellow-500" />
               ریست امتیازات دانش اموزان
            </p>

            <button
              onClick={() => resetScoresMutate()}
              disabled={deleting}
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
            >
              <RestartAltIcon />
              {deleting ? "در حال ریست..." : "ریست کامل امتیازات"}
            </button>
          </div>
        </motion.div>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import toast from "react-hot-toast";
import useQuestionsHooks from "@/app/hooks/useQuestionsHooks";

interface Option {
  text: string;
  is_correct: boolean;
}
interface ModalProps {
  Category: string;
  Lesson: number;
  season: number;
  onClose: () => void;
}

export default function AdminAddOperations({ onClose ,Category , Lesson ,season }: ModalProps) {
  const { addQuestion , getQuestions } = useQuestionsHooks();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<number | "">(0);
  const [selectedseason, setSelectedseason] = useState<number | "">(0);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  //console.log("filterdta" , FilterData[0].lesson_number);
  // const category = FilterData?.category 
  // const lesson_number = FilterData?.lesson_number 
  const {refetch} = useQuery({
    queryKey:["getdata"],
    queryFn :getQuestions
  })
//console.log("Category" , Category);

  useEffect(() => {
    if (Category) setSelectedCategory(Category);
    if (Lesson) setSelectedLesson(Lesson);
    if (season) setSelectedseason(season);
  }, [Category, Lesson , season]);
  
  console.log("cat , num ,  season" , selectedCategory,selectedLesson ,selectedseason );
  
  const addQuestionMutation = useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      refetch()
      setQuestionText("");
      setSelectedCategory("");
      setSelectedLesson("");
      setSelectedseason("");
      onClose()
      setOptions([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
    },
  });
  
  

  function handleOptionChange<K extends keyof Option>(
    index: number,
    field: K,
    value: Option[K]
  ) {
    const newOptions = [...options];
    newOptions[index][field] = value;
  
    if (field === "is_correct" && value) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
  
    setOptions(newOptions);
  }

  function handleSubmit() {
    if (!questionText || !selectedCategory || !selectedLesson || !selectedseason) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }
    if (!options.some((o) => o.is_correct)) {
      toast.error("یک گزینه درست باید مشخص شود");
      return;
    }
  
    toast.promise(
      addQuestionMutation.mutateAsync({
        text: questionText,
        category: selectedCategory,
        lesson_number: selectedLesson,
        lesson_season: selectedseason,
        options
      }),
      {
        loading: 'در حال ذخیره...',
        success: 'سوال اضافه شد 👍',
        error: 'خطا در اضافه کردن سوال ❌',
      }
    );
  }
  

  return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

          <div className="bg-amber-50 w-[600px] gap-2 relative z-10 max-w-md  space-y-8 p-8 rounded-md">    
          <button 
          className="border border-pink-200 rounded-full p-1 cursor-pointer hover:bg-pink-300"
          onClick={onClose}>
        ✖️
       </button>
      <Typography className="text-pink-700 mb-2" variant="h5" sx={{ textAlign: "center" }}>اضافه کردن سوال جدید</Typography>
      <TextField
      className="w-full "
        label="متن سوال"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        multiline
      />
<div className="mt-2 text-right" dir="rtl">
  <Typography className="text-pink-800 ">گزینه‌ها (یکی درست باشد)</Typography>
  <Stack spacing={1}>
    {options.map((opt, idx) => (
      <Paper key={idx} sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Radio
          checked={opt.is_correct}
          color="secondary"
          onChange={(e) => handleOptionChange(idx, "is_correct", e.target.checked)}
        />
        <TextField
          value={opt.text}
          onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
          fullWidth
          placeholder={`گزینه ${idx + 1}`}
        />
      </Paper>
    ))}
  </Stack>
</div>
<Button
      className="w-full py-3 font-semibold"
      variant="contained"
      color="secondary"
      onClick={handleSubmit}
      disabled={addQuestionMutation.isPending}
      sx={{
        borderRadius: "16px",
        background: "linear-gradient(90deg,#ec4899,#db2777)",
        "&:hover": { background: "linear-gradient(90deg,#db2777,#ec4899)" },
        boxShadow: 3,
      }}
    >
      {addQuestionMutation.isPending ?"در حال پردازش..."  : "اضافه کردن سوال"}
    </Button>
      </div>
      </div>
  );
}

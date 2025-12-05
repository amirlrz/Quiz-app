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
  category: string;
  Lesson: number;
  onClose: () => void;
  detail: {
    id: number;
    text: string;
    category: string;
    lesson_number: number;
    options: Option[];
  };
}

export default function AdminEditOperations({ onClose, detail }: ModalProps) {

  const { editQuestion, getQuestions } = useQuestionsHooks();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<number | "">("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  const { refetch } = useQuery({
    queryKey: ["getdata"],
    queryFn: getQuestions
  });

  console.log("detail" , detail);
  
  // مقداردهی اولیه فرم از detail
  useEffect(() => {
    if (detail) {
      setQuestionText(detail.text);
      setOptions(detail.options);
      setSelectedCategory(detail.category);
      setSelectedLesson(detail.lesson_number);
    }
  }, [detail]);

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

  const EditQuestionMutation = useMutation({
    mutationFn: editQuestion,
    onSuccess: () => {
      refetch();
      onClose();
    },
      onError: (err: unknown) => {
    if (err instanceof Error) {
      toast.error(err.message || "خطا در ویرایش سوال ❌");
    } else {
      toast.error("خطای ناشناخته ❌");
    }
  }
  });
  
  function handleSubmit() {
    if (!questionText || !selectedCategory || !selectedLesson) {
      toast.error("لطفا همه فیلدها را پر کنید!");
      return;
    }
  
    toast.promise(
      EditQuestionMutation.mutateAsync({
        id: detail.id,
        text: questionText,
        category: selectedCategory,
        lesson_number: selectedLesson,
        options,
      }),
      {
        loading: 'در حال ویرایش...',
        success: 'سوال ویرایش شد 👍',
        error: 'خطا در ویرایش سوال ❌',
      }
    );
  }
  

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="bg-amber-50 w-[600px] p-8 rounded-md space-y-8 max-w-md">
        
        <button
          className="border border-pink-200 rounded-full p-1 hover:bg-pink-300"
          onClick={onClose}
        >✖️</button>

        <Typography className="text-pink-700" variant="h5" sx={{ textAlign: "center" }}>
          ویرایش سوال
        </Typography>

        <TextField
          className="w-full"
          label="متن سوال"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          multiline
        />

        <Typography className="text-pink-800" dir="rtl">گزینه‌ها</Typography>

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

        <Button
          className="w-full py-3"
          variant="contained"
          color="secondary"
          disabled={EditQuestionMutation.isPending}
          onClick={handleSubmit}
        >
         {EditQuestionMutation.isPending ? "درحال پردازش" : "ذخیره تغییرات"} 
        </Button>

      </div>
    </div>
  );
}

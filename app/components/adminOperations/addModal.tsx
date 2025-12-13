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
import Image from "next/image";
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

export default function AdminAddOperations({
  onClose,
  Category,
  Lesson,
  season,
}: ModalProps) {
  const { addQuestion, getQuestions, uploadQuestionImage } =
    useQuestionsHooks();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<number | "">(0);
  const [selectedseason, setSelectedseason] = useState<number | "">(0);

  const [questionText, setQuestionText] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);

  const [options, setOptions] = useState<Option[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const { refetch } = useQuery({
    queryKey: ["getdata"],
    queryFn: getQuestions,
  });

  useEffect(() => {
    if (Category) setSelectedCategory(Category);
    if (Lesson) setSelectedLesson(Lesson);
    if (season) setSelectedseason(season);
  }, [Category, Lesson, season]);

  const addQuestionMutation = useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      refetch();
      toast.success("🎉 سوال با موفقیت اضافه شد");
      onClose();
    },
  });

  // ---------- Upload Image ----------
  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    toast.promise(
      uploadQuestionImage(file).then((url) => {
        setQuestionImageUrl(url);
      }),
      {
        loading: "در حال آپلود عکس...",
        success: "عکس با موفقیت آپلود شد 📸",
        error: "خطا در آپلود عکس ❌",
      }
    );
  }

  // ---------- Options ----------
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

  // ---------- Submit ----------
  function handleSubmit() {
    if (!questionText || !selectedCategory || !selectedLesson || !selectedseason) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (!options.some((o) => o.is_correct)) {
      toast.error("یک گزینه درست انتخاب کن");
      return;
    }

    addQuestionMutation.mutate({
      text: questionText,
      category: selectedCategory,
      lesson_number: selectedLesson,
      lesson_season: selectedseason,
      question_image_url: questionImageUrl,
      options,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-300 transition flex items-center justify-center text-lg"
        >
          ✖️
        </button>

        {/* Title */}
        <Typography
          variant="h5"
          className="text-center mb-2 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600"
        >
           اضافه کردن سوال جدید 
        </Typography>

        {/* Upload */}
        <label className="group cursor-pointer block">
  <div className="relative border-2 border-dashed border-pink-300 rounded-2xl p-2 text-center bg-pink-50 hover:bg-pink-100 transition aspect-9/3 flex items-center justify-center overflow-hidden">

    {/* اگر عکس انتخاب شده */}
    {questionImageUrl ? (
      <>
        <Image
          src={questionImageUrl}
          alt="preview"
          fill
          className="object-contain bg-white"
        />

        {/* دکمه حذف عکس */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            setQuestionImageUrl(null)
          }}
          className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-pink-600 transition"
        >
          ✕
        </button>
      </>
    ) : (
      /* حالت اولیه (دوربین) */
      <div className="text-3xl group-hover:scale-110 transition">
        📷
      </div>
    )}
  </div>

  <input
    type="file"
    hidden
    accept="image/*"
    onChange={handleFileChange}
  />
</label>


        {/* Question */}
        <TextField
          label="✏️ متن سوال"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          multiline
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px" } }}
        />

        {/* Options */}
        <div dir="rtl">
          <Typography className="mb-2 font-bold text-pink-700">
            گزینه‌ها (یکی درست باشد)
          </Typography>
          <Stack spacing={1}>
            {options.map((opt, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "12px",
                }}
              >
                <Radio
                  checked={opt.is_correct}
                  color="secondary"
                  onChange={(e) =>
                    handleOptionChange(idx, "is_correct", e.target.checked)
                  }
                />
                <TextField
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(idx, "text", e.target.value)
                  }
                  fullWidth
                  placeholder={`گزینه ${idx + 1}`}
                />
              </Paper>
            ))}
          </Stack>
        </div>

        {/* Submit */}
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={addQuestionMutation.isPending}
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "999px",
            background: "linear-gradient(90deg,#ec4899,#a855f7)",
            boxShadow: "0 10px 25px rgba(236,72,153,0.4)",
            "&:hover": {
              background: "linear-gradient(90deg,#a855f7,#ec4899)",
            },
          }}
        >
          {addQuestionMutation.isPending
            ? "⏳ در حال ذخیره..."
            : "🚀 اضافه کردن سوال"}
        </Button>
      </div>
    </div>
  );
}

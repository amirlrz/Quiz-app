"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import useQuestionsHooks from "@/app/hooks/useQuestionsHooks";

interface Option {
  text: string;
  is_correct: boolean;
}

interface ModalProps {
  onClose: () => void;
  detail: {
    id: number;
    text: string;
    category: string;
    lesson_number: number;
    options: Option[];
  };
}

export default function AdminDeleteOperations({ onClose, detail }: ModalProps) {

  const { deleteQuestion, getQuestions } = useQuestionsHooks();
  const { refetch } = useQuery({
    queryKey: ["getdata"],
    queryFn: getQuestions
  });

  console.log("detail" , detail?.id );
  
  const DeleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success("سوال حذف شد");
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
    DeleteQuestionMutation.mutate(detail.id);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="bg-amber-50 w-[600px] p-8 rounded-md space-y-8 max-w-md">
        
        <Typography  color="primary" variant="h5" sx={{ textAlign: "center" }}>
         ایا میخواهید سوال را حذف کنید ؟
        </Typography>
        <div className="grid grid-cols-2 mt-20 gap-3">

        <Button
          className="w-full py-3"
          variant="contained"
          color="primary"
          onClick={onClose}
        >
         بازگشت
        </Button>

        <Button
          className="w-full py-3"
          variant="contained"
          color= "error"
          onClick={handleSubmit}
        >
          حذف
        </Button>
      

        </div>
        
      </div>
    </div>
  );
}

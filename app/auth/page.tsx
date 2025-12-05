"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthHook from "../hooks/useAuthHook";
import Image from "next/image";

const schema = z.object({
  username: z.string(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

interface AuthMutationProps {
  password: string;
  isSignUp: boolean;
  username : string
}

type FormData = z.infer<typeof schema>;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { login, signUp } = useAuthHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password, isSignUp }: AuthMutationProps) =>
      isSignUp ? signUp({username, password} ) : login({username, password}),
    onSuccess: () => {
      toast.success("ورود با موفقیت انجام شد");
      router.push("/");
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message || "خطا در ویرایش سوال ❌");
      } else {
        toast.error("خطای ناشناخته ❌");
      }
    }
  });

  function onSubmit(data: FormData) {
    mutate({ ...data, isSignUp });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/7469379.jpg"
        alt="background"
        fill
        priority
        className="object-cover z-0 opacity-25"
      />

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 max-w-md w-full space-y-8 p-8">
        {/* عنوان */}
        <div className="text-center gap-2">
          <div className="text-4xl font-sans gap-2 animate-pulse font-bold text-white mb-3 flex justify-center">
            <p className="text-pink-500 font-bold">کلاس دوم</p>
            <p>کلمات</p>
            <p className="text-pink-500 font-bold">بازی</p>
          </div>

          <p className="text-gray-200 text-lg font-sans">
            {isSignUp ? "ایجاد حساب جدید" : "ورود به حساب کاربری"}
          </p>
        </div>

        {/* فرم */}
        <form
          className="space-y-6 font-sans text-right"
          dir="rtl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              لقب
            </label>
            <input
              {...register("username")}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-white/70 backdrop-blur text-black"
              placeholder="نام کاربری خود را وارد کنید"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              رمز عبور
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-white/70 backdrop-blur text-black"
              placeholder="رمز عبور را وارد کنید"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 rounded-xl shadow-md text-lg font-bold text-white bg-linear-to-br from-pink-500 to-red-500 disabled:opacity-50"
          >
            {isPending
              ? "در حال پردازش..."
              : isSignUp
              ? "ثبت نام"
              : "ورود"}
          </button>
        </form>

        {/* تغییر حالت */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-300 text-sm font-sans"
          >
            {isSignUp
              ? "قبلاً حساب ساخته‌اید؟ ورود"
              : "حساب ندارید؟ ثبت نام"}
          </button>
        </div>
      </div>
    </div>
  );
}

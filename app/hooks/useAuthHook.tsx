"use client"

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabse/client";

interface loginType {
    username : string
    password :string
}
export default function useAuthHook() {
  const supabase = createClient();
  const router = useRouter()

  async function getCurrentUserProfile() {
   
   
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error(authError?.message || "کاربر وارد نشده");
return user
    }
  



async function getUsers() {
  try {
    const res = await fetch("/api/get-users");
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    return data.users; 
  } catch (err: any) {
    throw new Error(err.message || "مشکل در دریافت کاربران");
  }
}
async function login({username, password}:loginType) {
    const fakeEmail = `${username}@game.local`;
  
    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });
  
    if (error) throw error;
    return true;
  }
  

  async function signUp({username, password}:loginType) {
    const fakeEmail = `${username}@game.local`;
  
    // check duplicate username
    const { data: exists } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
  
    if (exists) throw new Error("نام کاربری تکراری است");
  
    // Supabase signup with fake email
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
    });
  
    if (error) throw error;
    if (!data.user) throw new Error("خطا: کاربر ساخته نشد");
    // save username
    await supabase.from("profiles").insert({
      id: data.user.id,
      username,
    });
  
    return true;
  }

  async function insertExamCategory({
    lesson_season,
    category,
    lesson_number,
  }: {
    lesson_season:number
    category: string;
    lesson_number: number;
  }) {
    // ببین آیا رکوردی وجود دارد
    const { data: exists, error: selectError } = await supabase
      .from("category")
      .select("*")
      .limit(1)
      .maybeSingle();
  
    if (selectError) throw selectError;
  
    // اگر وجود داشت → آپدیت
    if (exists) {
      const { data, error } = await supabase
        .from("category")
        .update({
          lesson_season,
          category,
          lesson_number,
        })
        .eq("id", exists.id);
  
      if (error) throw error;
      return data;
    }
  
    // اگر وجود نداشت → اینسرت
    const { data, error } = await supabase
      .from("category")
      .insert({
        category,
        lesson_number,
      });
  
    if (error) throw error;
    return data;
  }
  

  async function getExamCategory() {
    const { data, error } = await supabase
      .from("category")
      .select("*");
  
    if (error) throw error;
    return data;
  };

  async function getCategoryDrop() {
    const { data, error } = await supabase
      .from("category_Drop")
      .select("*");
  
    if (error) throw error;
    return data;
  };
  async function getLesson_numDrop() {
    const { data, error } = await supabase
      .from("lesson_number")
      .select("*");
  
    if (error) throw error;
    return data;
  };
  async function getLesson_seasonDrop() {
    const { data, error } = await supabase
      .from("lesson_season")
      .select("*");
  
    if (error) throw error;
    return data;
  };

  async function insertUserScore({ userID, score, userName }: { userID: string; score: number; userName: string }) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userID,
          username: userName,
          score: score, // عدد
        },
        { onConflict: "id" } // اگر id موجود بود، آپدیت می‌کنه
      );
  
    if (error) throw error;
    return data;
  }
  

  async function getUserScore() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) throw error;
  return data;
};


  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/auth")
    //dispatch(clearSession())
    return true;
  }

  return { login, signUp ,signOut ,getUsers,getCurrentUserProfile ,insertUserScore ,getUserScore ,insertExamCategory ,getExamCategory ,getCategoryDrop ,getLesson_numDrop,getLesson_seasonDrop };
}

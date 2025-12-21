import { createClient } from "../lib/supabse/client";

export default function useQuestionsHooks(){
    const supabase = createClient();

    async function getQuestions() {
        const { data, error } = await supabase
          .from("questions")
          .select(`id, text, category,lesson_season, lesson_number, options(id, text, is_correct) ,question_image_url`)
          .order("created_at", { ascending: true });
      
        if (error) throw error;
        return data;
        
      }
      //عکس سوال
      const uploadQuestionImage = async (file: File) => {
        const fileName = `${Date.now()}-${file.name}`;
      
        // آپلود فایل به bucket
        const {  error } = await supabase.storage
          .from("question-images")
          .upload(fileName, file);
      
        if (error) throw error;
      
        // گرفتن URL عمومی
        const { data: publicUrl } = supabase.storage
          .from("question-images")
          .getPublicUrl(fileName);
      
        return publicUrl.publicUrl;
      };
      


      // ۲️⃣ اضافه کردن یک سوال جدید
// --------------------------------------
async function addQuestion({
  text,
  category,
  lesson_number,
  lesson_season,
  question_image_url,
  options
}: {
  text: string,
  category: string,
  question_image_url: string | null,
  lesson_number: number,
  lesson_season: number,
  options: { text: string; is_correct: boolean }[]
}) {
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  const teacher_id = user?.id;
  
  const { data : question ,  error: qErr } = await supabase
    .from("questions")
    .insert([{ teacher_id ,text, category, lesson_number ,lesson_season ,question_image_url }])
    .select()
    .single();

  if (qErr) throw qErr;

  const { error: oErr } = await supabase
    .from("options")
    .insert(
      options.map(opt => ({
        question_id: question.id,
        text: opt.text,
        is_correct: opt.is_correct
      }))
    );

  if (oErr) throw oErr;

  return question
}


  // ۳️⃣ ویرایش یک سوال و گزینه‌ها
// --------------------------------------
async function editQuestion({
  id,
  text,
  category,
  lesson_number,
  lesson_season,
  options
}: {
  id: number;
  text: string;
  category: string;
  lesson_number: number;
  lesson_season: number;
  options: { id?: string; text: string; is_correct: boolean }[];
}) {
  // update question
  const { error: qError } = await supabase
    .from("questions")
    .update({ text, category, lesson_number ,lesson_season })
    .eq("id", id);

  if (qError) throw qError;

  // update or insert each option
  for (const opt of options) {
    if (opt.id) {
      const { error } = await supabase
        .from("options")
        .update({ text: opt.text, is_correct: opt.is_correct })
        .eq("id", opt.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("options")
        .insert([{ question_id: id, text: opt.text, is_correct: opt.is_correct }]);
      if (error) throw error;
    }
  }

  return true;
}

  
  // ۴️⃣ حذف یک سوال و همه گزینه‌هایش
// --------------------------------------
 async function deleteQuestion(question_id: number) {
    const { error } = await supabase.from("questions").delete().eq("id", question_id);
    if (error) throw error;
    return true;
  }
  
  
    return {deleteQuestion , addQuestion ,getQuestions , editQuestion, uploadQuestionImage}
}
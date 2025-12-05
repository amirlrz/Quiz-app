import { createClient } from "../lib/supabse/client";

export default function useQuestionsHooks(){
    const supabase = createClient();

    async function getQuestions() {
        const { data, error } = await supabase
          .from("questions")
          .select(`id, text, category, lesson_number, options(id, text, is_correct)`)
          .order("created_at", { ascending: true });
      
        if (error) throw error;
        return data;
        
      }

      // ۲️⃣ اضافه کردن یک سوال جدید
// --------------------------------------
async function addQuestion({
  text,
  category,
  lesson_number,
  options
}: {
  text: string,
  category: string,
  lesson_number: number,
  options: { text: string; is_correct: boolean }[]
}) {
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  const teacher_id = user?.id;
  
  const { data : question ,  error: qErr } = await supabase
    .from("questions")
    .insert([{ teacher_id ,text, category, lesson_number }])
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
  options
}: {
  id: number;
  text: string;
  category: string;
  lesson_number: number;
  options: { id?: string; text: string; is_correct: boolean }[];
}) {
  // update question
  const { error: qError } = await supabase
    .from("questions")
    .update({ text, category, lesson_number })
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
  
  
    return {deleteQuestion , addQuestion ,getQuestions , editQuestion}
}
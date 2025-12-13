'use client'

import { useSelector } from "react-redux";
import ProgressBar from "../progressBar/page";
import { RootState } from "@/store";


interface Option {
    id: number;
    text: string;
    is_correct: boolean;
  }
  

interface QuizCardProps {
    question: string;
    options: Option[]; 
    selectedAnswer: number | null;
    onAnswerClick: (index: number) => void;
    onNext: () => void;
    currentQuestion: number;
    totalQuestions: number;
  }
  
  export default function QuizCard({
    question,
    options,
    selectedAnswer,
    onAnswerClick,
    onNext,
    currentQuestion,
    totalQuestions,
  }: QuizCardProps) {
    const colors = [
      'bg-gradient-to-br from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500',
      'bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500',
      'bg-gradient-to-br from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500',
      'bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
    ];
    const { category, lesson_number , lesson_season } = useSelector((state: RootState) => state.teacherFilterData);

    //console.log("category" , category);
    //console.log("lesson_number" , lesson_number);
    //console.log("selectedAnswer" , selectedAnswer);
    return (
      <>

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Progress */}
        <div
  className="
    fixed top-0 left-1/2 -translate-x-1/2
    bg-linear-to-r from-yellow-300 via-amber-400 to-yellow-300
    text-purple-900
    rounded-3xl shadow-xl
    font-bold
    p-3 md:p-1
    flex mb-3 md:flex-row
    items-center md:items-center
    gap-2 md:gap-4
    text-md md:text-2xl
    w-[90%] md:w-auto
    justify-center
    animate-bounce-slow
    border-4 border-purple-300
  "
>
  <span className="p-1 bg-white/60 rounded-xl shadow">📝 {lesson_number} درس</span>
  <span className="p-1 bg-white/60 rounded-xl shadow">🌈 فصل {lesson_season}</span>
  <span className="p-1 bg-white/60 rounded-xl shadow">📚 {category}</span>
</div>


        <div className="mb-6 text-center text-purple-600 font-sans">
          <p className="font-extrabold text-2xl">
         سوال {currentQuestion}
            </p>
          <ProgressBar totalQuestions={totalQuestions} currentQuestion={currentQuestion}/>
        </div>
  
        {/* Question Box */}
        <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8 shadow-lg">
          <p className="text-white text-center text-2xl">{question}</p>
        </div>
  
        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((option, index) => (
            <button
            key={index}
            onClick={() => onAnswerClick(index)}           
            className={`${colors[index]} text-white p-8 rounded-3xl transition-all duration-200 hover:scale-105 ${
              selectedAnswer === index
              ? 'ring-1 ring-purple-500 scale-105 animate-pulse'
              : ''
            }`}
            >
              <span className="text-xl">{option.text}</span>
            </button>
          ))}
        </div>
  
        {/* Next Button */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            disabled={selectedAnswer === null}
            className={`px-12 py-4 rounded-2xl text-white transition-all duration-200 ${
              selectedAnswer !== null
                ? 'bg-linear-to-r from-green-500 to-emerald-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      </>
    );
  }
  
import { useSelector } from "react-redux";
import ProgressBar from "../progressBar/page";


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
    const { category, lesson_number } = useSelector((state) => state.teacherFilterData);

    //console.log("options" , category);
    //console.log("selectedAnswer" , selectedAnswer);
    return (
      <>

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Progress */}
        <h2 className="text-xl md:text-2xl md:p-3 bg-amber-500 p-2 rounded-2xl font-bold fixed top-6 left-2/3 text-purple-900 ">
        {lesson_number}   {category} درس 
        </h2>
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
  
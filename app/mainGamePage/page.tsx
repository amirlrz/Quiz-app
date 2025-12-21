"use client"

import { useEffect, useState } from 'react';
import QuizCard from '../components/quiezSection/page';
import {  useMutation, useQuery } from '@tanstack/react-query';
import useQuestionsHooks from '../hooks/useQuestionsHooks';
import { useRouter } from 'next/navigation';
import useAuthHook from '../hooks/useAuthHook';
import { string } from 'zod';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setcategory, setlesson_number, setlesson_season } from '@/store/categorySlice';
import LinearProgress from '@mui/material/LinearProgress';


interface Option {
    id: number;
    text: string;
    is_correct: boolean;
  }
  


export default function GamePage() {

    const {getQuestions}= useQuestionsHooks()
    //const {text , options , category , lesson_number}= getQuestions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [Options, setOptions] = useState<Option[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [ImageUrl, setImageUrl] = useState<string>("");
  const [userID, setuserID] = useState<string>("");
  const [userName, setuserName] = useState<string>("");
  const {getCurrentUserProfile ,insertUserScore ,getExamCategory}=useAuthHook()
const route = useRouter()
const { category, lesson_number ,lesson_season } = useSelector((state: RootState) => state.teacherFilterData);

const dispatch =useDispatch()

    const {data:CategoryData } = useQuery({
      queryKey:["getCategory"],
      queryFn :getExamCategory
    })
  
    
    useEffect(() => {
      if (CategoryData && CategoryData.length > 0) {
        dispatch(setlesson_number(CategoryData[0].lesson_number))
        dispatch(setcategory(CategoryData[0].category))
        dispatch(setlesson_season(CategoryData[0].lesson_season))
      }
    }, [CategoryData, dispatch])

  const {data : AllData} = useQuery({
    queryKey:["getdata"],
    queryFn :getQuestions,
    enabled: !!category && !!lesson_number && !!lesson_season,
  })
 
 
  
  
  const data = AllData?.filter(
    (item) =>
      (category ? item.category === category : true) &&
      (lesson_number ? item.lesson_number === lesson_number : true) &&
      (lesson_season ? item.lesson_season === lesson_season : true)
  );
  console.log("data" ,data);

  const insertScore= useMutation({
    mutationKey :["SetScore"],
    mutationFn:insertUserScore
  })
  

const  {data:userdata }=useQuery({
    queryKey :["getCurrentUserProfile"],
    queryFn : getCurrentUserProfile
})
  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
  };
  //console.log("data", data)


useEffect(() => {
    if (data && data[currentQuestion]) {
      setOptions(data[currentQuestion].options);
      setQuestion(data[currentQuestion].text);
      setImageUrl(data[currentQuestion].question_image_url);
    }
  }, [data, currentQuestion]);
  

  useEffect(() => {
    if (userdata) {
      setuserID(userdata.id);
      setuserName(userdata.email?.split("@")[0]|| "");
    }
  }, [userdata]);
  
//console.log("userName" ,userName);


const handleNext = () => {
    if (selectedAnswer === null || !Options.length) return;
  
    const correctIndex = Options.findIndex(o => o.is_correct);
    //console.log("index" , correctIndex);
    
    if (selectedAnswer === correctIndex) {
      setScore(prev => prev + 1);
    }
  
    if (data && currentQuestion < data.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };
  ////
const handleShowResult = () =>{
    insertScore.mutate(
      { userID, score ,userName},
      {
        onSuccess: () => {
          route.push("/showResult");
        },
        onError: () => {
          toast.error("مشکلی پیش امده");
        }
      }
    ); 
}
  if (showResults) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h2 className="mb-4 text-pink-600 text-2xl">  ! افرین </h2>
          <p className="text-4xl mb-8 text-purple-600">
             تونستی به <span className="text-pink-400">{score}</span> 
             
            {' '}
            سوال
            پاسخ درست بدی  👋
        
            
          </p>
          {/* <button
            onClick={handleRestart}
            className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl hover:scale-105 transition-transform"
          >
            Play Again
          </button> */}
          <button
            onClick={handleShowResult}
            className="bg-linear-to-r from-purple-500  text-xl to-pink-500 text-white px-6 py-4 rounded-2xl hover:scale-105 transition-transform"
          >
            میخوای نتایج دوستاتو ببینی؟
          </button>
        </div>
      </div>
    );
  }
  if (!category || !AllData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LinearProgress color="secondary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center p-4">
      <QuizCard
      ImageUrl={ImageUrl ?? ''}
         question={question ?? ""}
        options={Options}
        selectedAnswer={selectedAnswer}
        onAnswerClick={handleAnswerClick}
        onNext={handleNext}
        currentQuestion={currentQuestion + 1}
        totalQuestions={data?.length ?? 0}
      />
    </div>
  );
}

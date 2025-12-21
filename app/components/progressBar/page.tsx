interface BarProps {
    totalQuestions: number;
    currentQuestion: number;
  }
  
  export default function ProgressBar({ totalQuestions, currentQuestion }: BarProps) {
    const percent = (currentQuestion / totalQuestions) * 100; // هر طرف 50%
  
    return (
      <div className="w-full mt-4 flex items-center justify-center gap-2 select-none">
        
  
        <div className="relative w-1/2 h-4 bg-pink-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-linear-to-r from-pink-500 to-pink-100 "
            style={{ width: `${percent}%` }}
          />
        </div>

      </div>
    );
  }
  
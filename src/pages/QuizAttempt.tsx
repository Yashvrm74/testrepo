import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const QUIZ_DATA = {
  id: "frontend-quiz",
  title: "Frontend Development Quiz",
  durationMinutes: 30,
  questions: [
    {
      id: 1,
      text: "Which function is used to find the average in Excel?",
      optionA: "SUM",
      optionB: "AVG",
      optionC: "AVERAGE",
      optionD: "MEAN",
      correctAnswer: "C",
    },
    {
      id: 2,
      text: "Which of these is used for conditional formatting in Excel?",
      optionA: "Data Validation",
      optionB: "Format Cells",
      optionC: "IF Statement",
      optionD: "Conditional Formatting",
      correctAnswer: "D",
    },
    {
      id: 3,
      text: "What does the VLOOKUP function do?",
      optionA: "Looks up a value vertically",
      optionB: "Sums up values",
      optionC: "Validates data",
      optionD: "Creates charts",
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "Which shortcut is used to insert a new worksheet in Excel?",
      optionA: "Ctrl + N",
      optionB: "Ctrl + Shift + N",
      optionC: "Shift + F11",
      optionD: "Ctrl + W",
      correctAnswer: "C",
    },
    {
      id: 5,
      text: "What does the IF function do in Excel?",
      optionA: "Iterates data",
      optionB: "Tests a condition",
      optionC: "Formats cells",
      optionD: "Locks cells",
      correctAnswer: "B",
    },
    {
      id: 6,
      text: "Which function returns the number of characters in a text string?",
      optionA: "LEN",
      optionB: "COUNT",
      optionC: "CHAR",
      optionD: "TEXT",
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "What does Ctrl + Z do in Excel?",
      optionA: "Redo",
      optionB: "Copy",
      optionC: "Undo",
      optionD: "Zoom",
      correctAnswer: "C",
    },
    {
      id: 8,
      text: "Which tab contains the PivotTable option?",
      optionA: "Home",
      optionB: "Insert",
      optionC: "Data",
      optionD: "Formulas",
      correctAnswer: "B",
    },
    {
      id: 9,
      text: "Which chart is best for showing proportions?",
      optionA: "Bar Chart",
      optionB: "Pie Chart",
      optionC: "Line Chart",
      optionD: "Scatter Plot",
      correctAnswer: "B",
    },
    {
      id: 10,
      text: "Which of these is a logical function?",
      optionA: "SUM",
      optionB: "VLOOKUP",
      optionC: "IF",
      optionD: "INDEX",
      correctAnswer: "C",
    },
    {
      id: 11,
      text: "What is the default file extension for Excel 2016?",
      optionA: ".xls",
      optionB: ".xlsx",
      optionC: ".xlsm",
      optionD: ".xltx",
      correctAnswer: "B",
    },
    {
      id: 12,
      text: "Which function counts only numeric values?",
      optionA: "COUNTA",
      optionB: "COUNTIF",
      optionC: "COUNT",
      optionD: "SUM",
      correctAnswer: "C",
    },
    {
      id: 13,
      text: "What does the CONCATENATE function do?",
      optionA: "Adds numbers",
      optionB: "Joins text",
      optionC: "Splits text",
      optionD: "Filters data",
      correctAnswer: "B",
    },
    {
      id: 14,
      text: "Which formula is used for dynamic ranges?",
      optionA: "OFFSET",
      optionB: "NOW",
      optionC: "TEXT",
      optionD: "TODAY",
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "What is the shortcut for bold text?",
      optionA: "Ctrl + U",
      optionB: "Ctrl + B",
      optionC: "Ctrl + I",
      optionD: "Ctrl + T",
      correctAnswer: "B",
    },
    {
      id: 16,
      text: "Which Excel feature helps in filtering data quickly?",
      optionA: "Sort",
      optionB: "Conditional Formatting",
      optionC: "AutoFilter",
      optionD: "PivotTable",
      correctAnswer: "C",
    },
    {
      id: 17,
      text: "Which function returns the current date?",
      optionA: "DATE",
      optionB: "NOW",
      optionC: "TODAY",
      optionD: "TIME",
      correctAnswer: "C",
    },
    {
      id: 18,
      text: "What does the TRIM function do?",
      optionA: "Remove spaces",
      optionB: "Convert text",
      optionC: "Round numbers",
      optionD: "Filter cells",
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "What is the shortcut for Save As?",
      optionA: "F12",
      optionB: "Ctrl + S",
      optionC: "Ctrl + A",
      optionD: "Shift + S",
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "Which tool helps in identifying trends over time?",
      optionA: "Histogram",
      optionB: "Line Chart",
      optionC: "Pie Chart",
      optionD: "Bubble Chart",
      correctAnswer: "B",
    },
  ],
};

const Disclaimer = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen py-20">
    <h2 className="text-2xl font-bold mb-4">Quiz Disclaimer</h2>
    <p className="mb-6 text-center max-w-md">
      You can give the test only once. Test is of 30 minutes.
    </p>
    <Button onClick={onStart} className="w-40">Start Test</Button>
  </div>
);

const QuizAttempt = ({ onQuizSubmit, moduleId: propModuleId }: { onQuizSubmit?: () => void; moduleId?: string }) => {
  const { courseId, moduleId: routeModuleId } = useParams<{ courseId: string; moduleId: string }>();
  const moduleId = propModuleId || routeModuleId;

  const [questions, setQuestions] = useState<typeof QUIZ_DATA.questions>([]);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [review, setReview] = useState<boolean[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [timer, setTimer] = useState(QUIZ_DATA.durationMinutes * 60);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
    setReview(new Array(questions.length).fill(false));
  }, [questions]);

  const handleSubmit = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const userId = user?.id;

    axios.get(`https://seminarroom.tech/api/progress/${userId}/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const prev = res.data;
      return axios.post('https://seminarroom.tech/api/progress', {
  userId,
  moduleId,
  readingMaterial: prev.readingMaterial || false,
  video: prev.video || false,
  assignment: prev.assignment || false,
  quiz: true, // ✅ Only set quiz=true on successful submit
}, {
  headers: { Authorization: `Bearer ${token}` },
});
    }).then(() => {
      const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctAnswer ? 1 : 0), 0);
      setScore(score);
      setSubmitted(true);
    }).catch(err => console.error('❌ Error saving quiz progress', err));
  }, [answers, moduleId, questions]);

  useEffect(() => {
    if (!started || submitted) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [started, submitted, handleSubmit]);

  const handleBackToQuiz = () => {
    window.history.length > 1 ? window.history.back() : window.location.assign(`/module/${courseId}/${moduleId}`);
  };

  const handleOptionChange = (option: string) => {
    setAnswers(prev => prev.map((a, i) => i === current ? option : a));
  };

  const handleUnmark = () => {
    setAnswers(prev => prev.map((a, i) => i === current ? null : a));
  };

  const handleReview = () => {
    setReview(prev => prev.map((r, i) => i === current ? !r : r));
  };

  if (submitted && showResult) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Quiz Review</h2>
        <p className="text-center text-lg mb-6">
          You scored <span className="font-bold">{score}</span> out of {questions.length}
        </p>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className="border p-6 rounded bg-white shadow">
                <h3 className="font-semibold mb-2">Q{idx + 1}: {q.text}</h3>
                <p><strong>Your Answer:</strong> <span className={isCorrect ? "text-green-600" : "text-red-600"}>{userAnswer ?? 'Not Answered'}</span></p>
                {!isCorrect && <p><strong>Correct Answer:</strong> <span className="text-green-700">{q.correctAnswer}</span></p>}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleBackToQuiz}>Back to Course</Button>
        </div>
      </div>
    );
  }

  if (submitted && !showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-screen py-20">
        <h2 className="text-2xl font-bold mb-4">Quiz Submitted</h2>
        <p className="mb-6">You scored {score} out of {questions.length}</p>
        <div className="flex gap-4">
          <Button onClick={() => setShowResult(true)}>View Result</Button>
          <Button onClick={handleBackToQuiz}>Back to Course</Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return <Disclaimer onStart={() => {
      const shuffled = shuffleArray(QUIZ_DATA.questions);
      setQuestions(shuffled);
      setAnswers(new Array(shuffled.length).fill(null));
      setReview(new Array(shuffled.length).fill(false));
      setStarted(true);
    }} />;
  }

  const q = questions[current];
  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");

  return (
    <div className="flex flex-row gap-4 px-4 py-10">
      {showSidebar && (
        <div className="w-1/5 border-r pr-4">
          <h3 className="font-bold text-lg mb-4">Questions</h3>
          <div className="flex flex-col gap-2">
            {questions.map((_, idx) => {
              let bg = "bg-slate-100";
              if (answers[idx] !== null) bg = "bg-green-200";
              if (review[idx]) bg = "bg-yellow-300";
              if (idx === current) bg = "bg-blue-500 text-white";
              return (
                <button
                  key={idx}
                  className={`w-full py-2 rounded text-sm font-semibold border ${bg}`}
                  onClick={() => setCurrent(idx)}
                >
                  Q{idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 relative">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setShowSidebar(p => !p)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold">Quiz</h2>
          </div>
          <div className="absolute right-0 -top-6 font-mono text-lg bg-slate-100 px-4 py-2 rounded">
            {mins}:{secs}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center text-center">
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 border border-purple-200 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-semibold">
                Question {current + 1} of {questions.length}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {QUIZ_DATA.title}
              </span>
            </div>
            <div className="mb-4 text-lg font-semibold text-gray-800 leading-relaxed">{q.text}</div>
            <div className="grid grid-cols-1 gap-3">
              {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                    answers[current] === opt
                      ? "bg-purple-50 border-purple-400 shadow"
                      : "bg-slate-50 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    checked={answers[current] === opt}
                    onChange={() => handleOptionChange(opt)}
                    className="accent-purple-600 h-4 w-4"
                  />
                  <span className="text-base text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 flex-wrap justify-center">
          <Button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} variant="outline">
            Previous
          </Button>
          <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1} variant="outline">
            Next
          </Button>
          <Button onClick={handleUnmark} variant="outline">Unmark</Button>
          <Button onClick={handleReview} variant={review[current] ? "default" : "outline"}>
            {review[current] ? "Unmark Review" : "Mark for Review"}
          </Button>
          {answers.every((a) => a !== null) && (
            <Button onClick={handleSubmit} variant="destructive">Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;

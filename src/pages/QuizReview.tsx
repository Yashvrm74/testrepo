import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QUIZ_DATA = {
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


const QuizReview = () => {
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();

  useEffect(() => {
    const simulatedAnswers = ["required", "placeholder", "required"];
    setAnswers(simulatedAnswers);

    const calculatedScore = QUIZ_DATA.questions.reduce((acc, q, idx) => {
      return acc + (simulatedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    setScore(calculatedScore);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-700 text-center">
        You scored {score} out of {QUIZ_DATA.questions.length}
      </h3>

      {QUIZ_DATA.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === q.correctAnswer;
        return (
          <div key={q.id} className="border rounded-lg p-5 bg-white shadow">
            <h4 className="font-semibold text-gray-800 mb-2">Q{idx + 1}: {q.text}</h4>
            <p>
              <strong>Your Answer:</strong>{" "}
              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                {userAnswer ?? "Not Answered"}
              </span>
            </p>
            {!isCorrect && (
              <p>
                <strong>Correct Answer:</strong>{" "}
                <span className="text-green-700">{q.correctAnswer}</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              {isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </p>
          </div>
        );
      })}

      <div className="text-center mt-10">
        <Button
  onClick={() => {
    navigate(`/module/${courseId}/${moduleId}/`);
    setTimeout(() => window.location.reload(), 100); // slight delay to ensure navigation finishes
  }}
  className="bg-purple-600 text-white"
>
  Back to Course
</Button>

      </div>
    </div>
  );
};

export default QuizReview;

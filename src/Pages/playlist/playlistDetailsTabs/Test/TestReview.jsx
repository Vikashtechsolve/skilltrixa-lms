import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

// --- Reusable Read-Only Option Component ---
const ReviewOption = ({ option, question, optionIndex, userAnswer, answerResult }) => {
  // Get option ID (either from option.id or generate from index)
  const optionId = option.id || String.fromCharCode(97 + optionIndex); // 'a', 'b', 'c', 'd'
  
  // Check if user selected this option
  const isSelected = userAnswer === optionIndex;
  
  // Check if this option was the correct one (if user got it right, selectedOptionId is the correct answer)
  // If user got it wrong, we can't determine the correct answer from API (security feature)
  // But we can show: if selected and correct=true, this is correct; if selected and correct=false, this is wrong
  const isUserCorrect = answerResult?.correct && answerResult?.selectedOptionId === optionId;
  const isUserWrong = !answerResult?.correct && answerResult?.selectedOptionId === optionId;
  
  // If user got it right, the selected option is the correct one
  // If user got it wrong, we don't know which is correct (backend doesn't reveal it)
  const isCorrectAnswer = answerResult?.correct && answerResult?.selectedOptionId === optionId;
  
  let borderColor = "border-transparent";
  let icon = null;

  if (isCorrectAnswer) {
    // User selected this and it's correct
    borderColor = "border-green-500";
    icon = <FaCheck className="text-green-500" />;
  } else if (isUserWrong) {
    // User selected this but it's wrong
    borderColor = "border-red-500";
    icon = <FaTimes className="text-red-500" />;
  } else if (isSelected && answerResult && !answerResult.correct) {
    // User selected this option but answer was wrong (fallback)
    borderColor = "border-red-500";
    icon = <FaTimes className="text-red-500" />;
  }

  return (
    <div className={`bg-gray-700 p-4 rounded-lg border-2 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex">
          <span className="font-semibold text-gray-400 mr-4">
            {String.fromCharCode(65 + optionIndex)}.
          </span>
          <span className="text-gray-200">{option.text}</span>
        </div>
        {icon}
      </div>
      {(isCorrectAnswer || isUserWrong || (isSelected && answerResult)) && (
        <div className="mt-3 pl-8 text-sm">
          <p className={isCorrectAnswer ? "text-green-400" : "text-red-400"}>
            {isCorrectAnswer ? "That's Right" : "Not quite"}
          </p>
          <p className="text-gray-400">{answerResult?.hint || option.explanation || ""}</p>
        </div>
      )}
    </div>
  );
};

// --- Main Review Component ---
// 1. Receive 'onBackToResult' and 'onRetake'
const TestReview = ({ data, answers, quizResult, onRetake, onBackToResult }) => {
  // Create a map of questionId to answer result for quick lookup
  const answerResultMap = {};
  if (quizResult?.answers) {
    quizResult.answers.forEach((ans) => {
      answerResultMap[ans.questionId] = ans;
    });
  }

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">
          Review Answers – {data.title}
        </h2>

        {/* 2. Add button controls */}
        <div className="flex space-x-4">
          <button
            onClick={onBackToResult}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg"
          >
            Back to Result
          </button>
          <button
            onClick={onRetake}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retake Test
          </button>
        </div>
      </div>

      {/* Map over all questions */}
      <div className="space-y-8">
        {data.questions?.map((question, index) => {
          const answerResult = answerResultMap[question._id];
          return (
            <div key={question._id || index}>
              <p className="text-lg text-gray-200 mb-4">
                Ques {index + 1}. {question.text}
              </p>
              <div className="space-y-4">
                {question.options.map((option, optionIndex) => (
                  <ReviewOption
                    key={optionIndex}
                    option={option}
                    question={question}
                    optionIndex={optionIndex}
                    userAnswer={answers[index]}
                    answerResult={answerResult}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestReview;

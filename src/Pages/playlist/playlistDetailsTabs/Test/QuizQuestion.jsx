import React, { useState } from "react";
import { FaChevronDown, FaCheck, FaTimes } from "react-icons/fa";

// --- Reusable Option Component (with instant feedback) ---
const Option = ({
  option,
  question,
  isSelected,
  isAnswered,
  onSelect,
  optionIndex,
}) => {
  // Check if this option is the correct answer
  const isCorrect = question.correctOptionId === option.id;
  let borderColor = "border-transparent"; // Default border
  let icon = null;

  if (isSelected) {
    // Show immediate feedback when option is selected
    if (isCorrect) {
      borderColor = "border-green-500"; // Green for correct answer
      icon = <FaCheck className="text-green-500" />;
    } else {
      borderColor = "border-red-500"; // Red for wrong answer
      icon = <FaTimes className="text-red-500" />;
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-lg border-2 transition-all
        ${
          isAnswered ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"
        }
        ${borderColor}
      `}
      style={{ backgroundColor: '#212121' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          <span className="font-semibold text-gray-400 mr-4">
            {String.fromCharCode(65 + optionIndex)}.
          </span>
          <span className="text-gray-200">{option.text}</span>
        </div>
        {icon}
      </div>

      {/* Show explanation if this option was selected during quiz */}
      {isSelected && option.explanation && (
        <div className="mt-3 pl-8 text-sm">
          <p className="text-gray-400">{option.explanation}</p>
        </div>
      )}
    </div>
  );
};

// --- Main Quiz Question Component ---
const QuizQuestions = ({ data, onFinishQuiz, isSubmitting }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);

  const totalQuestions = data.questions?.length || 0;
  const question = data.questions?.[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== undefined;

  if (!question) {
    return <div className="text-gray-400">No questions available.</div>;
  }

  const handleSelectAnswer = (optionIndex) => {
    if (isAnswered) return; // Don't allow changing answer
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowHint(false);
    }
  };

  const handleFinish = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length === totalQuestions) {
      onFinishQuiz(answers);
    } else {
      // In a real app, use a modal, not an alert
      alert("Please answer all questions before finishing.");
    }
  };

  return (
    <div className="bg-black p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-left text-gray-300 mb-6">
        Test - {data.title}
      </h2>
      <div className="flex">
        {/* Question Nav */}
        <div className="hidden sm:flex flex-col space-y-4 pr-8 border-r border-gray-700">
          {data.questions.map((_, index) => (
            <span
              key={index}
              className={`text-lg cursor-pointer ${
                index === currentQuestion
                  ? "text-white font-bold"
                  : answers[index] !== undefined
                  ? "text-green-500" // Show answered questions
                  : "text-gray-500 hover:text-gray-300"
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </span>
          ))}
        </div>

        {/* Question Content */}
        <div className="pl-0 sm:pl-8 flex-1">
          <p className="text-lg text-gray-300 text-left mb-6">
            Ques {currentQuestion + 1}. {question.text}
          </p>
          <div className="bg-black space-y-4 text-left">
            {question.options.map((option, index) => (
              <Option 
                key={index}
                option={option}
                question={question}
                optionIndex={index}
                isSelected={selectedAnswer === index}
                isAnswered={isAnswered}
                onSelect={() => handleSelectAnswer(index)}
              />
            ))}
          </div>

          {/* Hint */}
          <div className="mt-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm  text-gray-400 hover:text-white flex items-center"
            >
              Show hint{" "}
              <FaChevronDown
                className={`ml-2 text-left transition-transform ${
                  showHint ? "rotate-180" : ""
                }`}
                size={12}
              />
            </button>
            {showHint && (
              <div className="text-left p-4 rounded-lg mt-3 text-gray-200" style={{ backgroundColor: '#212121' }}>
                {question.hint}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="hover:opacity-80 text-gray-100 py-2 px-6 rounded-md disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#212121' }}
            >
              Previous
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleFinish}
                disabled={isSubmitting || !isAnswered}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Finish"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered} // User must answer to proceed
                className="hover:opacity-80 text-gray-100 py-2 px-6 rounded-md disabled:opacity-50 transition-all"
                style={{ backgroundColor: '#212121' }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;

// src/components/playlistDetailsTabs/Test/Test.jsx
import React, { useState, useEffect } from "react";
import { quizAPI } from "../../../../utils/api";
import TestSummary from "./TestSummary";
import QuizQuestions from "./QuizQuestion";
import TestResult from "./TestResult";
import TestReview from "./TestReview";

const Test = ({ test, sessionId }) => {
  // ------------------------
  // ❗ ALL HOOKS AT TOP
  // ------------------------
  const [page, setPage] = useState("summary"); 
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPreviousAttempt, setLoadingPreviousAttempt] = useState(true);

  // Check for previous attempts when component loads
  useEffect(() => {
    const checkPreviousAttempts = async () => {
      if (!test?._id) {
        setLoadingPreviousAttempt(false);
        return;
      }

      try {
        const response = await quizAPI.getMyQuizAttempts(test._id);
        if (response.success && response.data && response.data.length > 0) {
          // Get the most recent completed attempt
          const latestAttempt = response.data.find(a => a.submittedAt) || response.data[0];
          
          if (latestAttempt.submittedAt && latestAttempt._id) {
            // Fetch full attempt details including answers
            try {
              const attemptResponse = await quizAPI.getQuizAttemptById(latestAttempt._id);
              if (attemptResponse.success && attemptResponse.data) {
                const fullAttempt = attemptResponse.data;
                
                // Transform answers from API format to frontend format (index-based)
                const transformedAnswers = {};
                if (fullAttempt.answers && test.questions) {
                  fullAttempt.answers.forEach((ans) => {
                    const questionIndex = test.questions.findIndex(q => q._id === ans.questionId);
                    if (questionIndex !== -1) {
                      // Find the option index that matches the selectedOptionId
                      const question = test.questions[questionIndex];
                      const optionIndex = question.options.findIndex(
                        opt => opt.id === ans.selectedOptionId
                      );
                      if (optionIndex !== -1) {
                        transformedAnswers[questionIndex] = optionIndex;
                      }
                    }
                  });
                }
                
                setQuizResult(fullAttempt);
                setAnswers(transformedAnswers);
                setPage("result");
              }
            } catch (err) {
              console.error("Failed to fetch attempt details:", err);
              // Fallback: show result with basic info
              setQuizResult({
                score: latestAttempt.score,
                passed: latestAttempt.passed,
                submittedAt: latestAttempt.submittedAt,
                startedAt: latestAttempt.startedAt,
                attemptNumber: latestAttempt.attemptNumber
              });
              setPage("result");
            }
          }
        }
      } catch (err) {
        console.error("Failed to check previous attempts:", err);
        // Don't show error to user, just proceed normally
      } finally {
        setLoadingPreviousAttempt(false);
      }
    };

    checkPreviousAttempts();
  }, [test?._id]);

  // ❗ If NO test data → return AFTER all hooks
  if (!test) {
    return <div className="text-gray-400">No quiz data available.</div>;
  }

  if (loadingPreviousAttempt) {
    return <div className="text-gray-400">Loading...</div>;
  }

  // ------------------------
  // Handlers
  // ------------------------
  const startQuiz = async () => {
    if (!test._id || !sessionId) {
      alert("Missing quiz or session information");
      return;
    }

    setIsStarting(true);
    try {
      const response = await quizAPI.startQuizAttempt(test._id, sessionId);
      if (response.success && response.data) {
        setAttemptId(response.data._id);
        setAnswers({});
        setQuizResult(null);
        setPage("questions");
      } else {
        alert("Failed to start quiz attempt: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to start quiz attempt:", err);
      alert("Failed to start quiz attempt. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    if (!test._id || !attemptId) {
      alert("Missing quiz or attempt information");
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform answers to API format: [{ questionId, selectedOptionId }]
      const apiAnswers = test.questions.map((question, index) => {
        const selectedIndex = finalAnswers[index];
        const selectedOption = question.options[selectedIndex];
        // Get option ID from the option (should be "a", "b", "c", "d" etc.)
        // If options don't have id field, use index-based mapping
        const optionId = selectedOption?.id || String.fromCharCode(97 + selectedIndex); // 'a', 'b', 'c', 'd'
        
        return {
          questionId: question._id,
          selectedOptionId: optionId
        };
      });

      const response = await quizAPI.submitQuizAttempt(test._id, attemptId, apiAnswers);
      if (response.success && response.data) {
        setQuizResult(response.data.attempt);
        // Keep the user's answers (index-based) for review
        setAnswers(finalAnswers);
        setPage("result");
      } else {
        alert("Failed to submit quiz: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    setPage("review");
  };

  const handleBackToResult = () => {
    setPage("result");
  };

  const retakeQuiz = () => {
    setAnswers({});
    setAttemptId(null);
    setQuizResult(null);
    setPage("summary");
  };

  // ------------------------
  // CLEAN PAGE SWITCHER (SAFE)
  // ------------------------
  switch (page) {
    case "summary":
      return (
        <TestSummary 
          data={test} 
          onAttemptNow={startQuiz}
          isStarting={isStarting}
        />
      );

    case "questions":
      return (
        <QuizQuestions 
          data={test} 
          onFinishQuiz={finishQuiz}
          isSubmitting={isSubmitting}
        />
      );

    case "result":
      return (
        <TestResult
          data={test}
          answers={answers}
          quizResult={quizResult}
          onRetake={retakeQuiz}
          onReview={handleReview}
        />
      );

    case "review":
      return (
        <TestReview
          data={test}
          answers={answers}
          quizResult={quizResult}
          onRetake={retakeQuiz}
          onBackToResult={handleBackToResult}
        />
      );

    default:
      return <div className="text-red-400">Invalid test state</div>;
  }
};

export default Test;

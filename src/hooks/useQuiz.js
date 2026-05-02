/**
 * @fileoverview Custom hook for quiz state and progression logic.
 * Extracts scoring and navigation from the Quiz page component.
 * @module hooks/useQuiz
 */

import { useState, useCallback, useMemo } from 'react';
import { logQuizCompleted } from '../utils/analytics';

/**
 * @typedef {Object} QuizState
 * @property {number} currentIndex - Current question index.
 * @property {number|null} selectedAnswer - User's selected option index.
 * @property {boolean} answered - Whether current question is answered.
 * @property {number} score - Current score.
 * @property {boolean} completed - Whether quiz is finished.
 * @property {number} percentage - Final score as percentage.
 */

/**
 * useQuiz — manages quiz progression, scoring, and completion.
 * @param {Array} questions - Array of question objects.
 * @returns {QuizState & { selectAnswer: Function, nextQuestion: Function, resetQuiz: Function }}
 */
export function useQuiz(questions = []) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = useMemo(
    () => questions[currentIndex] || null,
    [questions, currentIndex]
  );

  const percentage = useMemo(
    () =>
      questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
    [score, questions.length]
  );

  const selectAnswer = useCallback(
    (answerIndex) => {
      if (answered) return;
      setSelectedAnswer(answerIndex);
      setAnswered(true);
      if (answerIndex === currentQuestion?.correct) {
        setScore((prev) => prev + 1);
      }
    },
    [answered, currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true);
      logQuizCompleted(undefined, score);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  }, [currentIndex, questions.length, score]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setCompleted(false);
  }, []);

  return {
    currentIndex,
    selectedAnswer,
    answered,
    score,
    completed,
    percentage,
    currentQuestion,
    selectAnswer,
    nextQuestion,
    resetQuiz,
  };
}

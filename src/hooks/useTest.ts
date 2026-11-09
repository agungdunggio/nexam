'use client';

import { useMemo } from 'react';
import { useTestStore } from '@/stores/testStore';

export function useTest() {
  const {
    session,
    questions,
    isLoading,
    isSubmitting,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    startTest,
    setAnswer,
    removeAnswer,
    toggleFlag,
    goToQuestion,
    goNext,
    goPrevious,
    submitTest,
    resetTest,
    loadProgress,
  } = useTestStore();

  const totalQuestions = questions.length;

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  const answeredIndices = useMemo(() => {
    const indices = new Set<number>();
    questions.forEach((q, idx) => {
      if (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id].trim() !== '') {
        indices.add(idx);
      }
    });
    return indices;
  }, [questions, answers]);

  const flaggedSet = useMemo(() => {
    return new Set<number>(flaggedQuestions);
  }, [flaggedQuestions]);

  const answeredCount = answeredIndices.size;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const flaggedCount = flaggedQuestions.length;

  return {
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    answeredIndices,
    flaggedSet,
    answeredCount,
    unansweredCount,
    flaggedCount,
    isLoading,
    isSubmitting,
    startTest,
    setAnswer,
    removeAnswer,
    toggleFlag,
    goToQuestion,
    goNext,
    goPrevious,
    submitTest,
    resetTest,
    loadProgress,
  };
}

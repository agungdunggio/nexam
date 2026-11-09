import { create } from 'zustand';
import { Question, TestSession, TestType } from '@/types/test';

interface TestState {
  session: TestSession | null;
  questions: Question[];
  isLoading: boolean;
  isSubmitting: boolean;

  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> answer
  flaggedQuestions: number[]; // array of question indices

  // Actions
  startTest: (testType: TestType, subtest: string) => Promise<string | null>;
  setAnswer: (questionId: string, answer: string) => void;
  removeAnswer: (questionId: string) => void;
  toggleFlag: (questionIndex: number) => void;
  goToQuestion: (index: number) => void;
  goNext: () => void;
  goPrevious: () => void;
  submitTest: (timeSpentSec: number, autoSubmitted?: boolean) => Promise<{ sessionId: string } | null>;
  resetTest: () => void;
  saveProgress: () => void;
  loadProgress: (sessionId: string) => Promise<boolean>;
}

export const useTestStore = create<TestState>((set, get) => ({
  session: null,
  questions: [],
  isLoading: false,
  isSubmitting: false,

  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: [],

  startTest: async (testType: TestType, subtest: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_type: testType, subtest }),
      });

      const data = await res.json();
      if (data.success && data.session) {
        const session: TestSession = {
          id: data.session.id,
          testType: data.session.test_type,
          subtest: data.session.subtest,
          timeLimitSec: data.session.time_limit_sec,
          startedAt: data.session.started_at,
          status: 'in_progress',
        };

        set({
          session,
          questions: data.session.questions || [],
          currentQuestionIndex: 0,
          answers: {},
          flaggedQuestions: [],
          isLoading: false,
        });

        get().saveProgress();
        return session.id;
      }
      set({ isLoading: false });
      return null;
    } catch {
      set({ isLoading: false });
      return null;
    }
  },

  setAnswer: (questionId: string, answer: string) => {
    const nextAnswers = { ...get().answers, [questionId]: answer };
    set({ answers: nextAnswers });
    get().saveProgress();
  },

  removeAnswer: (questionId: string) => {
    const nextAnswers = { ...get().answers };
    delete nextAnswers[questionId];
    set({ answers: nextAnswers });
    get().saveProgress();
  },

  toggleFlag: (questionIndex: number) => {
    const flags = [...get().flaggedQuestions];
    const idx = flags.indexOf(questionIndex);
    if (idx > -1) {
      flags.splice(idx, 1);
    } else {
      flags.push(questionIndex);
    }
    set({ flaggedQuestions: flags });
  },

  goToQuestion: (index: number) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  goNext: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  goPrevious: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  submitTest: async (timeSpentSec: number, autoSubmitted = false) => {
    const { session, answers, questions } = get();
    if (!session) return null;

    set({ isSubmitting: true });
    try {
      const payloadAnswers = questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] || null,
      }));

      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          answers: payloadAnswers,
          time_spent_sec: timeSpentSec,
          auto_submitted: autoSubmitted,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(`nexam_test_${session.id}`);
        }
        set({ isSubmitting: false });
        return { sessionId: session.id };
      }
      set({ isSubmitting: false });
      return null;
    } catch {
      set({ isSubmitting: false });
      return null;
    }
  },

  resetTest: () => {
    set({
      session: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: [],
      isLoading: false,
      isSubmitting: false,
    });
  },

  saveProgress: () => {
    const { session, answers, currentQuestionIndex } = get();
    if (!session || typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem(
        `nexam_test_${session.id}`,
        JSON.stringify({ answers, currentQuestionIndex })
      );
    } catch {
      // Ignore sessionStorage errors
    }
  },

  loadProgress: async (sessionId: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/test/${sessionId}`);
      if (!res.ok) {
        set({ isLoading: false });
        return false;
      }
      const data = await res.json();
      if (data.session) {
        let savedAnswers: Record<string, string> = data.session.saved_answers || {};
        let savedIndex = 0;

        if (typeof sessionStorage !== 'undefined') {
          const cached = sessionStorage.getItem(`nexam_test_${sessionId}`);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              savedAnswers = { ...savedAnswers, ...parsed.answers };
              savedIndex = parsed.currentQuestionIndex || 0;
            } catch {
              // Ignore parse error
            }
          }
        }

        set({
          session: {
            id: data.session.id,
            testType: data.session.test_type,
            subtest: data.session.subtest,
            timeLimitSec: data.session.time_limit_sec,
            startedAt: data.session.started_at,
            status: data.session.status,
          },
          questions: data.session.questions || [],
          answers: savedAnswers,
          currentQuestionIndex: savedIndex,
          isLoading: false,
        });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },
}));

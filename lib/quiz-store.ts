import { create } from 'zustand';

interface QuizStore {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: number | null;
  timeRemaining: number;
  
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  startQuiz: (maxTime: number) => void;
  updateTimeRemaining: (seconds: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuestionIndex: 0,
  answers: {},
  startTime: null,
  timeRemaining: 300, // 5 minutes default

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  startQuiz: (maxTime) =>
    set({
      startTime: Date.now(),
      timeRemaining: maxTime,
      currentQuestionIndex: 0,
      answers: {},
    }),

  updateTimeRemaining: (seconds) => set({ timeRemaining: seconds }),

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      answers: {},
      startTime: null,
      timeRemaining: 300,
    }),
}));
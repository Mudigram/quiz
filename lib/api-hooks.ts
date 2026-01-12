'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { Quiz, Question, QuizAttempt, LeaderboardEntry, PastAttempt } from './types';
import { calculateScore, getCorrectAnswersCount } from './utils';


// Fetch all quizzes
export const useQuizzes = () => {
  return useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch current week's active quiz
export const useActiveQuiz = () => {
  return useQuery<Quiz | null>({
    queryKey: ['activeQuiz'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No active quiz
        throw error;
      }
      return data;
    },
  });
};

// Fetch all questions for a quiz
export const useQuizQuestions = (quizId: string | undefined) => {
  return useQuery<Question[]>({
    queryKey: ['quizQuestions', quizId],
    queryFn: async () => {
      if (!quizId) throw new Error('Quiz ID is required');

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });
};

// Check if user has already attempted this quiz
export const useUserAttempt = (userId: string | undefined, quizId: string | undefined) => {
  return useQuery<QuizAttempt | null>({
    queryKey: ['userAttempt', userId, quizId],
    queryFn: async () => {
      if (!userId || !quizId) return null;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_id', quizId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!quizId,
  });
};

// Fetch leaderboard for a quiz
export const useLeaderboard = (quizId: string | undefined, limit: number = 50) => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', quizId, limit],
    queryFn: async () => {
      if (!quizId) throw new Error('Quiz ID is required');

      const { data, error } = await supabase.rpc('get_leaderboard', {
        p_quiz_id: quizId,
        p_limit: limit,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });
};

// Fetch user's past quiz attempts
export const usePreviousAttempts = (userId: string | undefined) => {
  return useQuery<PastAttempt[]>({
    queryKey: ['previousAttempts', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes!inner (
            title,
            week_start_date
          )
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return data.map((attempt) => ({
        ...attempt,
        quiz_title: attempt.quizzes.title,
        quiz_week_start: attempt.quizzes.week_start_date,
      }));
    },
    enabled: !!userId,
  });
};

// Submit quiz mutation
export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      quizId,
      answers,
      timeTakenSeconds,
      questions,
    }: {
      userId: string;
      quizId: string;
      answers: Record<string, string>;
      timeTakenSeconds: number;
      questions: Question[];
    }) => {
      const correctAnswers = getCorrectAnswersCount(answers, questions);
      const { finalScore } = calculateScore(correctAnswers, questions.length, timeTakenSeconds);

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          score: finalScore,
          time_taken_seconds: timeTakenSeconds,
          correct_answers: correctAnswers,
          total_questions: questions.length,
          answers: answers,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userAttempt', variables.userId, variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['previousAttempts', variables.userId] });
    },
  });
};
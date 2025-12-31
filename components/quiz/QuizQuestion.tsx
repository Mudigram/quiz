'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '@/lib/types';
import { useQuizStore } from '@/lib/quiz-store';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onComplete: (answers: Record<string, string>, timeTaken: number) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onComplete,
}: QuizQuestionProps) {
  const { setCurrentQuestionIndex, setAnswer, answers, startTime } = useQuizStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isLastQuestion = questionNumber === totalQuestions;

  const options = [
    { value: 'A', text: question.option_a },
    { value: 'B', text: question.option_b },
    { value: 'C', text: question.option_c },
    { value: 'D', text: question.option_d },
  ];

  const handleAnswerSelect = (answer: string) => {
    setAnswer(question.id, answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      setShowConfirmModal(true);
    } else {
      setCurrentQuestionIndex(questionNumber);
    }
  };

  const handleSubmit = () => {
    if (!startTime) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onComplete(answers, timeTaken);
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto slide-up">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">{question.question_text}</h2>
          <p className="text-sm text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest">Select one answer</p>
        </div>

        <div className="space-y-3 mb-8">
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAnswer === option.value
                  ? 'border-brand-mint bg-brand-mint/5 dark:bg-brand-mint/10'
                  : 'border-brand-gray dark:border-zinc-800 hover:border-brand-purple/50 bg-white dark:bg-brand-black'
                }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={selectedAnswer === option.value}
                onChange={() => handleAnswerSelect(option.value)}
                className="input-radio mt-1"
              />
              <div className="flex-1">
                <div className="font-bold text-brand-black dark:text-brand-white uppercase tracking-tight">
                  <span className="text-brand-purple mr-2">{option.value}.</span> {option.text}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex items-center gap-2"
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full fade-in">
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Confirm Submission</h3>
            <p className="text-zinc-600 mb-6">
              Are you sure you want to submit your quiz? You cannot change your answers after
              submission.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Confirm Submission
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
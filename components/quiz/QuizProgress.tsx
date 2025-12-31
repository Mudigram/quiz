interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">
        Question {current} / {total}
      </span>
      <div className="w-48 h-2 bg-brand-gray dark:bg-brand-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-mint transition-all duration-300"
          style={{
            width: `${percentage}%`,
            boxShadow: '0 0 10px rgba(64, 255, 175, 0.5)'
          }}
        />
      </div>
    </div>
  );
}
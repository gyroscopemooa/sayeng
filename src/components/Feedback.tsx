interface FeedbackProps {
  result: 'correct' | 'incorrect' | null;
}

export const Feedback = ({ result }: FeedbackProps) => {
  if (!result) return null;

  return (
    <div className={`feedback animate-bounce ${result}`}>
      {result === 'correct' ? 'Excellent!' : 'Try Again'}
    </div>
  );
};

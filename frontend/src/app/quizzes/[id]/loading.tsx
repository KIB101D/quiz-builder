export default function QuizLoading() {
  return (
    <div aria-busy="true" aria-label="Loading quiz" className="animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-24 rounded bg-line" />
        <div className="h-8 w-72 max-w-full rounded-lg bg-line" />
        <div className="h-4 w-48 rounded bg-line" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-44 rounded-xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

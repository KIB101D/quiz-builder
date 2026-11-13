export default function QuizzesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading quizzes" className="animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-40 rounded-lg bg-line" />
        <div className="h-4 w-80 max-w-full rounded bg-line" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[92px] rounded-xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

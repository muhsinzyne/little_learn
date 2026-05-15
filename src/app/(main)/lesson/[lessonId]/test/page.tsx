export default function LessonTestPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">Test Mode</span>
        <h1 className="text-3xl font-bold text-slate-800 mt-4">Can you find the letter A?</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {['B', 'A', 'C', 'D'].map((choice) => (
          <button key={choice} className="aspect-square bg-white rounded-2xl border-4 border-slate-100 flex items-center justify-center text-6xl font-bold text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

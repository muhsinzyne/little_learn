export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Learning Progress</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-700">Overall Completion</h3>
            <p className="text-sm text-slate-500">How much you&apos;ve learned so far!</p>
          </div>
          <div className="text-2xl font-bold text-blue-600">45%</div>
        </div>
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[45%]"></div>
        </div>
      </div>
    </div>
  );
}

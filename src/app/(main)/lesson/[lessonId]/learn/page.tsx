export default function LessonLearnPage() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-12">
        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">Learning Mode</span>
      </div>
      <div className="aspect-square bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mb-12">
        <span className="text-9xl font-bold text-slate-800">A</span>
      </div>
      <h2 className="text-4xl font-bold text-slate-800 mb-4">Letter A</h2>
      <p className="text-xl text-slate-500 mb-12">Apple starts with the letter A!</p>
      
      <div className="flex gap-4 justify-center">
        <button className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors">Previous</button>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Next Lesson</button>
      </div>
    </div>
  );
}

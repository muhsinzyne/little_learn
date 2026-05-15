import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-ll-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-ll-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-ll-purple rounded-xl shadow-lg flex items-center justify-center text-white font-black text-xl">L</div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">LittleLearn</span>
        </div>
        <Link 
          href="/login" 
          className="font-black text-slate-600 hover:text-ll-purple transition-colors uppercase tracking-widest text-sm"
        >
          Log In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <span className="bg-ll-yellow/20 text-ll-orange px-6 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
            Preschool Learning Made Fun
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tight mb-8 leading-[1.1]">
            Learning is an <br />
            <span className="text-ll-purple">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-2xl mx-auto mb-12 leading-relaxed">
            A safe, playful platform designed for children aged 3–6. Learn letters, numbers, shapes, and more through interactive lessons.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-ll-purple text-white font-black px-12 py-6 rounded-[2.5rem] text-2xl shadow-xl hover:bg-ll-purple-dark hover:shadow-ll-purple/20 transition-all active:scale-95"
            >
              Get Started Free
            </Link>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xl overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`} alt="Avatar" />
                </div>
              ))}
              <div className="pl-6 flex flex-col items-start justify-center">
                <span className="text-slate-800 font-black text-sm">Join 500+</span>
                <span className="text-slate-400 font-bold text-xs">Happy Little Learners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-[10%] text-6xl animate-bounce-subtle opacity-20 pointer-events-none hidden lg:block">🎨</div>
        <div className="absolute top-1/3 right-[10%] text-6xl animate-bounce-subtle opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: '0.5s' }}>🧩</div>
        <div className="absolute bottom-1/4 left-[15%] text-6xl animate-bounce-subtle opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: '1s' }}>🌈</div>
        <div className="absolute bottom-1/3 right-[15%] text-6xl animate-bounce-subtle opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }}>🌟</div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-50 text-center relative z-10">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          &copy; {new Date().getFullYear()} LittleLearn. Created with ❤️ for kids.
        </p>
      </footer>
    </div>
  );
}

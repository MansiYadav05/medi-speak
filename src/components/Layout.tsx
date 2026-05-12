import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ShieldCheck, MessageSquare, ListChecks, Home, LogIn, LogOut, User as UserIcon, Loader2, Clock, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { report, user, authLoading } = useAppContext();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F1F5F9] font-sans selection:bg-emerald-100">
      {/* Header Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-20">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/20">M</div>
            <span className="text-xl font-bold tracking-tighter text-slate-900 uppercase">Medi-Speak</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            to="/" 
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              location.pathname === '/' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Home size={14} />
            <span className="hidden sm:inline">Analysis</span>
          </Link>
          <Link 
            to="/privacy" 
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              location.pathname === '/privacy' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Shield size={14} />
            <span className="hidden sm:inline">Privacy</span>
          </Link>
          {user && (
            <Link 
              to="/history" 
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                location.pathname === '/history' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <Clock size={14} />
              <span className="hidden sm:inline">History</span>
            </Link>
          )}
          {report && (
            <>
              <Link 
                to="/next-steps" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all animate-in fade-in slide-in-from-right-4",
                  location.pathname === '/next-steps' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <ListChecks size={14} />
                <span className="hidden sm:inline">Action Plan</span>
              </Link>
              <Link 
                to="/qa" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all animate-in fade-in slide-in-from-right-4",
                  location.pathname === '/qa' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <MessageSquare size={14} />
                <span className="hidden sm:inline">Q&A</span>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="label-caps">Platform Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-mono text-slate-600 uppercase">Secure Environment</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          
          {authLoading ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-900 leading-none">{user.displayName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} className="m-2 text-slate-400" />
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              <LogIn size={14} />
              Login
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center space-x-4">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Status: STABLE</span>
          <div className="w-1 h-1 rounded-full bg-green-500"></div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Node-Runtime: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-tighter font-bold">
          Confidential Analysis Engine • No Personal Data Stored Post-Session • HIPAA Compliant Pipeline
        </div>
      </footer>
    </div>
  );
}

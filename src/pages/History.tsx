import { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Trash2, 
  ChevronRight,
  FileText,
  Loader2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getUserReports, deleteReport } from '../lib/firestoreUtils';

export default function History() {
  const { user, authLoading, setReport, setOriginalScrubbedText } = useAppContext();
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function loadReports() {
      if (user) {
        try {
          const data = await getUserReports(user.uid);
          setReports(data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadReports();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    
    setDeletingId(id);
    try {
      await deleteReport(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewReport = (report: any) => {
    setReport(report.content);
    setOriginalScrubbedText(report.originalText || '');
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading History...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Reports</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Historical Medical Interpretations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
          <Lock size={12} />
          Encrypted Storage
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {reports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-10">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Reports Saved</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                Your analyzed medical reports will appear here once you save them to your account.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                Analyze a Report
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={report.id}
                  onClick={() => handleViewReport(report)}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{report.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Analyzed on {report.createdAt?.toLocaleDateString()} at {report.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleDelete(report.id, e)}
                      disabled={deletingId === report.id}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      {deletingId === report.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Stethoscope,
  Calendar,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

export default function NextSteps() {
  const { report } = useAppContext();
  const navigate = useNavigate();

  // Redirect if no report exists
  useEffect(() => {
    if (!report) {
      navigate('/');
    }
  }, [report, navigate]);

  if (!report) return null;

  // Extract the Next Steps section from the markdown report
  const nextStepsContent = report.match(/## (?:🚀 )?Potential Next Steps[\s\S]*?(?=## (?:🛡️ )?Disclaimer|$)/i)?.[0] || "No specific next steps were identified. Please consult your physician.";

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
            <h2 className="text-xl font-bold text-slate-900">Your Action Plan</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Prioritized Health Management</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recommended Steps</h3>
            </div>
            
            <div className="prose prose-slate prose-emerald max-w-none markdown-content">
              <ReactMarkdown>{nextStepsContent}</ReactMarkdown>
            </div>
          </motion.div>

          {/* Contextual Advice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <Stethoscope size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wider">Physician Consultation</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take these simplified results to your next appointment. Ask your doctor how these findings align with your current treatment plan.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <Calendar size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wider">Follow-Up Timing</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the report mentions "follow-up," check with the receptionist to ensure an appointment is scheduled within the recommended timeframe.
              </p>
            </motion.div>
          </div>

          {/* Safety Notice */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4"
          >
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm text-amber-900 mb-1">Important Safety Note</h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                If you experience new or worsening symptoms before your next scheduled visit, contact your healthcare provider immediately or visit the emergency room. This action plan does not replace emergency medical care.
              </p>
            </div>
          </motion.div>
          
          <div className="flex justify-center pt-4">
             <button 
                onClick={() => navigate('/qa')}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                Discuss these steps in Q&A
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

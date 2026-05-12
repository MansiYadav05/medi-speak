import { Shield, EyeOff, Lock, Server, UserCheck, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyCenter() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10"
        >
          <Shield size={32} />
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">Privacy Center</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Your medical records contain your life's most sensitive data. Here is exactly how we ensure it stays between you and your doctor.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Layer 1: Instant Anonymization */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <EyeOff size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">1. Instant Scrubbing</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The moment you upload a document, our <strong>SCRUBBED Engine</strong> scans for PII (Personally Identifiable Information). Names, addresses, and phone numbers are removed <em>before</em> interpretation begins.
          </p>
        </motion.div>

        {/* Layer 2: Encrypted Identity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <UserCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">2. Identity-First Privacy</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your name visible in the dashboard is only seen by <strong>you</strong> during your secure session. We use Firebase Authentication to ensure that only the verified account owner can unlock their stored history.
          </p>
        </motion.div>

        {/* Layer 3: Zero-Knowledge Storage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">3. Hardened Storage</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Analysis results are stored in a distributed encrypted database. Firestore security rules prevent even system administrators from accessing your data without an explicit debug token (which you must approve).
          </p>
        </motion.div>

        {/* Layer 4: AI Isolation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6">
            <Server size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">4. AI Isolation</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We use Vertex AI in a secure VPC (Virtual Private Cloud). Your data is never used to train global AI models. Every session is treated as a temporary, isolated request that expires after analysis.
          </p>
        </motion.div>
      </div>

      <div className="bg-slate-900 text-white px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-6 italic">"Privacy is not an option, it's a fundamental requirement for medical trust."</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
        >
          Back to Analysis
        </button>
      </div>
    </div>
  );
}

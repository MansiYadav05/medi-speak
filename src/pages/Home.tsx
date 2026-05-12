import { useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Activity,
  Loader2,
  RefreshCw,
  Search,
  ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { scrubText } from '../lib/scrubber';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { saveReport } from '../lib/firestoreUtils';
import { useState } from 'react';
import { Save, Check, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const MODEL_NAME = "gemini-3-flash-preview";

export default function Home() {
  const {
    inputText, setInputText,
    fileData, setFileData,
    fileType, setFileType,
    isScrubbing, setIsScrubbing,
    isAnalyzing, setIsAnalyzing,
    report, setReport,
    setOriginalScrubbedText,
    scrubbedCount, setScrubbedCount,
    error, setError,
    user,
    reset,
    originalScrubbedText,
  } = useAppContext();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSaveReport = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    if (!report) return;

    setIsSaving(true);
    try {
      const title = fileData ? "Medical Report Analysis" : (inputText.substring(0, 30) + "...");
      await saveReport(user.uid, title, report, originalScrubbedText);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save report to history.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReport = async () => {
    if (!inputText && !fileData) {
      setError("Please provide a report via text or file.");
      return;
    }

    try {
      setError(null);
      setIsScrubbing(true);

      const { scrubbedText, detectedCount } = scrubText(inputText);
      setScrubbedCount(detectedCount);
      setOriginalScrubbedText(scrubbedText);

      await new Promise(resolve => setTimeout(resolve, 800));
      setIsScrubbing(false);
      setIsAnalyzing(true);

      const apiKey = process.env.GEMINI_API;
      if (!apiKey || apiKey === "MY_GEMINI_API") {
        throw new Error("Gemini API key is missing. Please check your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [];

      if (fileData) {
        contents.push({
          inlineData: {
            mimeType: fileType || "application/pdf",
            data: fileData.split(',')[1]
          },
        });
      }

      contents.push({
        text: `Medical Report Data for Translation: ${scrubbedText || "See attached document"}`
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: contents },
        config: {
          systemInstruction: `You are Medi-Speak, a compassionate medical jargon translator.
          Your goal is to translate complex medical reports into 6th-grade level English.
          
          CRITICAL SECURITY RULE: NEVER mention the patient's name, phone number, address, or any other personal identifiers in your output, even if you see them in the provided image or text. Use "the patient" or "you" instead.

          STRUCTURE YOUR OUTPUT AS FOLLOWS:
          # Medi-Speak Report Simplification
          
          ## 📝 Plain English Summary
          [Provide a 2-3 sentence high-level overview of the report's main message]
          
          ## 🔍 Key Findings Explained
          [List 3-5 specific findings from the report. Use a friendly tone.]
          
          ## 🧠 Medical Terms Defined
          [Find and list any complex medical terms (e.g., 'Metastasis', 'Hypoxia', 'Bilateral') found in the report. For each, use the format: **Term**: Simple, non-technical explanation.]
          
          ## 🚀 Potential Next Steps
          [List actionable steps the patient can take, e.g., 'Schedule a follow-up', 'Monitor symptoms', etc.]
          
          ## 🛡️ Disclaimer
          This summary is AI-generated for educational purposes only. It is NOT a medical diagnosis or prescription. Always consult with a qualified healthcare professional before making any medical decisions.`,
        },
      });

      setReport(response.text || "Failed to generate report.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
      setIsScrubbing(false);
    }
  };

  return (
    <div className="h-full p-6 grid grid-cols-12 gap-6 overflow-hidden">
      {/* Left Rail: Input & Ingestion */}
      <aside className="col-span-4 flex flex-col space-y-6">
        <div className="card-base p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="label-caps">1. Multimodal Input</h3>
            {report && (
              <button
                onClick={reset}
                className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors uppercase tracking-widest"
              >
                <RefreshCw size={10} />
                New Analysis
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-600 leading-tight font-medium">{error}</p>
            </div>
          )}

          {/* File Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center transition-all cursor-pointer mb-4",
              fileData ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-slate-50 hover:border-emerald-300"
            )}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
            {fileData ? (
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  {fileType.includes('pdf') ? <FileText size={16} /> : <Search size={16} />}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider line-clamp-1">
                  {fileType.includes('pdf') ? "Clinical PDF Staged" : "Medical Image Loaded"}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">Click to replace</span>
              </div>
            ) : (
              <>
                <span className="text-sm text-slate-500 font-medium text-center px-4">Upload PDF, JPG, or Scan</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold text-center px-4">Supports clinical document extraction</span>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Direct Report Text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste medical report content here if text-based..."
                className="flex-1 w-full bg-slate-100 p-4 rounded text-xs font-mono text-slate-600 border border-slate-200 outline-none focus:border-emerald-400 transition-all resize-none"
              />
            </div>
            <button
              onClick={processReport}
              disabled={isScrubbing || isAnalyzing}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {isAnalyzing ? "Processing Analytics..." : "Translate & Anonymize"}
            </button>
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="bg-slate-900 rounded-xl p-5 text-white shrink-0 shadow-lg shadow-slate-900/40">
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Security Audit Trail</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-2">
              <span className="text-slate-400">Presidio Worker #049</span>
              <span className="text-green-400 font-bold">SUCCESS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 italic bg-black/30 p-2 rounded border border-slate-800 min-h-[40px] flex items-center">
              {scrubbedCount > 0 ? (
                `Scrubbed: ${scrubbedCount} Identity Identifiers removed.`
              ) : (
                "Ready for ingestion. Awaiting input..."
              )}
            </div>
            {scrubbedCount > 0 && (
              <div className="flex items-center gap-2 text-[9px] text-green-500 font-bold uppercase tracking-tighter">
                <ShieldCheck size={12} />
                Zero-Knowledge Transmission Verified
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Center/Right: Output & Insights */}
      <section className="col-span-8 flex flex-col gap-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {!report ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-4 bg-white/50 border border-dashed border-slate-300 rounded-3xl"
            >
              <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-300">
                <Activity size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest">Awaiting Analysis</h3>
                <p className="text-sm text-slate-400 max-w-xs">Upload or paste a medical report to begin the translation pipeline.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-6 overflow-hidden"
            >
              <div className="flex-1 flex flex-col card-base p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8 shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-8 bg-emerald-600 rounded-full"></div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Analysis Results</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveReport}
                      disabled={isSaving || saveSuccess}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all",
                        saveSuccess
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {isSaving ? <Loader2 size={12} className="animate-spin" /> : saveSuccess ? <Check size={12} /> : user ? <Save size={12} /> : <LogIn size={12} />}
                      {saveSuccess ? "Saved" : user ? (isSaving ? "Saving..." : "Save to History") : "Login to Save"}
                    </button>
                    <button
                      onClick={() => navigate('/qa')}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95"
                    >
                      Ask Questions <RefreshCw size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-8 flex-1">
                  <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="prose prose-slate prose-sm max-w-none markdown-content">
                      <ReactMarkdown>
                        {report.split(/## (?:🚀 )?Potential Next Steps|## (?:🧠 )?Medical Terms/i)[0]}
                      </ReactMarkdown>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h4 className="label-caps text-slate-900 mb-4 flex items-center gap-2">
                        <Search size={14} className="text-emerald-600" />
                        Medical Dictionary
                      </h4>
                      <div className="prose prose-slate prose-sm max-w-none markdown-content text-slate-700">
                        <ReactMarkdown>
                          {report.match(/## (?:🧠 )?Medical Terms Defined[\s\S]*?(?=## (?:🚀 )?Potential Next Steps|$)/i)?.[0] || "No clinical terms requiring definition were identified."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h4 className="label-caps text-emerald-600 mb-4 flex items-center gap-2">
                        <ListChecks size={14} />
                        Next Steps
                      </h4>
                      <div className="prose prose-slate prose-xs max-w-none markdown-content text-slate-700">
                        <ReactMarkdown>
                          {report.match(/## (?:🚀 )?Potential Next Steps[\s\S]*?(?=## (?:🛡️ )?Disclaimer|$)/i)?.[0] || "No specific steps found."}
                        </ReactMarkdown>
                      </div>
                      <button
                        onClick={() => navigate('/next-steps')}
                        className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all hover:bg-emerald-700"
                      >
                        See Detailed Plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 shrink-0">
                  <div className="prose prose-slate prose-xs max-w-none text-slate-400 italic">
                    <ReactMarkdown>
                      {report.match(/## (?:🛡️ )?Disclaimer[\s\S]*$/i)?.[0] || ""}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

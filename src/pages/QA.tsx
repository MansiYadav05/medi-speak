import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import {
  MessageSquare,
  Loader2,
  ChevronRight,
  Send,
  User,
  Bot,
  ArrowLeft,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const MODEL_NAME = "gemini-3-flash-preview";

export default function QA() {
  const {
    report,
    chatHistory, setChatHistory,
    fileData, fileType,
    originalScrubbedText,
    error, setError
  } = useAppContext();

  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const navigate = useNavigate();

  // Redirect if no report exists
  useEffect(() => {
    if (!report) {
      navigate('/');
    }
  }, [report, navigate]);

  const handleQuestion = async () => {
    if (!question.trim() || !report) return;

    setIsAsking(true);
    const currentQuestion = question.trim();
    setQuestion('');

    try {
      const apiKey = process.env.GEMINI_API;
      if (!apiKey || apiKey === "MY_GEMINI_API") {
        throw new Error("Gemini API key is missing.");
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
        text: `CONTEXT DATA:
              --- ORIGINAL REPORT TEXT (SCRUBBED) ---
              ${originalScrubbedText || "N/A"}
              
              --- SIMPLIFIED SUMMARY ---
              ${report}
              
              --- PREVIOUS CONVERSATION ---
              ${chatHistory.map(c => `Q: ${c.question}\nA: ${c.answer}`).join('\n')}
              
              USER QUESTION: ${currentQuestion}
              
              TASK: Answer the user's question about their medical results using BOTH the original source material and the simplified summary.
              - Use extremely simple English.
              - Reference specific values from the original source if relevant.
              - Keep it brief (max 3 sentences).`
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: contents },
        config: {
          systemInstruction: "You are a specialized medical jargon translator. Help users understand their reports. NEVER mention names. Always include a disclaimer that you are an AI.",
        }
      });

      const answer = response.text || "I couldn't process that question.";
      setChatHistory(prev => [...prev, { question: currentQuestion, answer }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get an answer.");
    } finally {
      setIsAsking(false);
    }
  };

  if (!report) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* QA Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Patient Q&A Session</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Deep Understanding Mode Active</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
          {"Context Ref: "}{originalScrubbedText ? "OCR + LLM Grounded" : "Report grounded"}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar scroll-smooth">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare size={40} />
            </div>
            <div className="max-w-md">
              <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-1">No Questions Yet</h3>
              <p className="text-xs text-slate-500">Ask anything related to your report. For example: "What does my RBC level mean?" or "Should I be worried about the finding in my chest X-ray?"</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-8">
            {chatHistory.map((chat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* User Message */}
                <div className="flex justify-end gap-3">
                  <div className="flex flex-col items-end max-w-[80%]">
                    <div className="bg-slate-100 text-slate-800 px-6 py-3 rounded-2xl rounded-tr-none text-sm font-medium shadow-sm">
                      {chat.question}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-tighter flex items-center gap-1">
                      Patient <User size={8} />
                    </span>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start gap-3">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-lg shadow-emerald-600/20">
                      {chat.answer}
                    </div>
                    <span className="text-[9px] text-emerald-600 mt-1 font-bold uppercase tracking-tighter flex items-center gap-1">
                      <Bot size={8} /> Medi-Speak Assistant
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-4xl mx-auto flex flex-col space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-1">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-600 leading-tight font-medium">{error}</p>
            </div>
          )}

          <div className="relative group">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleQuestion();
                }
              }}
              placeholder="Ask a question about your report results..."
              className="w-full text-base p-6 rounded-3xl bg-white border border-slate-200 shadow-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none min-h-[120px] pr-20"
            />
            <button
              onClick={handleQuestion}
              disabled={isAsking || !question.trim()}
              className="absolute right-4 bottom-4 w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isAsking ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
            </button>
          </div>
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shift + Enter for new line • Enter to send</p>
            <div className="flex items-center gap-1.5 grayscale opacity-50">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Privacy Guard Protected</span>
              <ShieldCheck size={12} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

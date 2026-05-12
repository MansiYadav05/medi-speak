import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface ChatMessage {
  question: string;
  answer: string;
}

interface AppContextType {
  inputText: string;
  setInputText: (val: string) => void;
  fileData: string | null;
  setFileData: (val: string | null) => void;
  fileType: string;
  setFileType: (val: string) => void;
  isScrubbing: boolean;
  setIsScrubbing: (val: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  report: string | null;
  setReport: (val: string | null) => void;
  originalScrubbedText: string;
  setOriginalScrubbedText: (val: string) => void;
  scrubbedCount: number;
  setScrubbedCount: (val: number) => void;
  error: string | null;
  setError: (val: string | null) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (val: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  user: User | null;
  authLoading: boolean;
  reset: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [inputText, setInputText] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [originalScrubbedText, setOriginalScrubbedText] = useState<string>('');
  const [scrubbedCount, setScrubbedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const reset = () => {
    setInputText('');
    setFileData(null);
    setFileType('');
    setReport(null);
    setOriginalScrubbedText('');
    setChatHistory([]);
    setScrubbedCount(0);
    setError(null);
  };

  return (
    <AppContext.Provider value={{
      inputText, setInputText,
      fileData, setFileData,
      fileType, setFileType,
      isScrubbing, setIsScrubbing,
      isAnalyzing, setIsAnalyzing,
      report, setReport,
      originalScrubbedText, setOriginalScrubbedText,
      scrubbedCount, setScrubbedCount,
      error, setError,
      chatHistory, setChatHistory,
      user, authLoading,
      reset
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

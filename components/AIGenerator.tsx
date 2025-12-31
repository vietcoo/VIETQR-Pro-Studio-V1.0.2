
import React, { useState } from 'react';
import { generateSmartQRContent } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface AIGeneratorProps {
  onSuccess: (content: string, type: string) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateSmartQRContent(prompt);
      if (data) {
        setResult(data.summary);
        onSuccess(data.content, data.type);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ví dụ: Tạo mã wifi cho văn phòng tầng 2, tên mạng là 'VIETQR-PRO' mật khẩu '668899'..."
          className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm group-hover:shadow-md"
        />
        <div className="absolute bottom-3 right-3">
          <Button 
            onClick={handleGenerate} 
            isLoading={loading}
            disabled={!prompt.trim()}
            className="rounded-full h-10 w-10 p-0 shadow-lg bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {result && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-900/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">{result}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

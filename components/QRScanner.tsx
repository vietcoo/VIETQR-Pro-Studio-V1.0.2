
import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { Button } from './Button';
import { Upload, Camera, Search, RefreshCw, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (content: string) => void;
  t: any;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, t }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScannedData(null);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        setPreviewUrl(event.target?.result as string);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScannedData(code.data);
        } else {
          setError(t.error);
        }
        setIsScanning(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Search className="w-48 h-48" /></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 flex items-center gap-4"><Zap className="w-10 h-10 text-amber-400" /> {t.title}</h2>
          <p className="text-indigo-100 text-lg max-w-2xl font-medium">{t.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" hidden />
          
          {previewUrl ? (
            <div className="relative w-full aspect-square max-w-[300px] mb-6 group">
              <img src={previewUrl} className="w-full h-full object-contain rounded-2xl border dark:border-gray-800 shadow-md" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl text-white font-bold gap-2"
              >
                <RefreshCw className="w-6 h-6" /> {t.change}
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[300px] aspect-square border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                <Upload className="w-10 h-10" />
              </div>
              <span className="font-black text-gray-500 uppercase tracking-widest text-xs">{t.upload}</span>
            </div>
          )}

          <p className="mt-6 text-[11px] text-gray-400 font-medium text-center">{t.tip}</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.results}
            </h3>

            {isScanning ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-600">
                <RefreshCw className="w-10 h-10 animate-spin" />
                <span className="font-bold">{t.scanning}</span>
              </div>
            ) : scannedData ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 break-all font-mono text-sm text-gray-700 dark:text-gray-300 min-h-[120px]">
                  {scannedData}
                </div>
                <Button 
                  onClick={() => onScanSuccess(scannedData)}
                  className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {t.action}
                </Button>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-red-500 text-center px-4">
                <AlertTriangle className="w-12 h-12" />
                <span className="font-bold text-sm">{error}</span>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>{t.upload}</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-300">
                <Camera className="w-16 h-16 opacity-20" />
                <span className="text-xs font-medium italic">{t.waiting}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dòng lưu ý quan trọng */}
      <div className="mt-4 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-[1.5rem] border border-amber-200 dark:border-amber-900/30 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm font-bold text-amber-900 dark:text-amber-200 leading-relaxed">
          {t.note}
        </p>
      </div>
    </div>
  );
};

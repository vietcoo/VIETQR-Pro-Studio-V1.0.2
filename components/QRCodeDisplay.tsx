
import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRSettings } from '../types';
import { Button } from './Button';
import { Download, Save, Copy, Check, FileCode, Printer } from 'lucide-react';

interface QRCodeDisplayProps {
  settings: QRSettings;
  onSave?: () => void;
  canSave?: boolean;
  qrName?: string;
  t: any;
  // Fix: Added language property to the interface to resolve missing variable error
  language: 'vi' | 'en';
}

/**
 * Hàm encodeUtf8: Chuyển đổi chuỗi UTF-16 của JavaScript sang chuỗi chứa các byte UTF-8.
 * Đây là kỹ thuật "binary string" ép trình tạo mã QR sử dụng Byte Mode chính xác 
 * cho các ký tự đa byte như tiếng Việt.
 */
const encodeUtf8 = (str: string): string => {
  try {
    return unescape(encodeURIComponent(str));
  } catch (e) {
    return str;
  }
};

// Fix: Destructured language from props
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ settings, onSave, canSave = false, qrName, t, language }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState(() => new QRCodeStyling({
    width: settings.size,
    height: settings.size,
    type: 'canvas',
    data: encodeUtf8(settings.value),
    dotsOptions: {
      color: settings.fgColor,
      type: settings.dotsType as any
    },
    backgroundOptions: {
      color: settings.bgColor,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 5,
      imageSize: settings.logoScale
    },
    qrOptions: {
      errorCorrectionLevel: settings.level,
      typeNumber: 0
    }
  }));

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);
  }, []);

  useEffect(() => {
    // Mã hóa UTF-8 trước khi cập nhật dữ liệu vào QR
    const rawData = String(settings.value || "https://vietshareprintpack.com");
    const utf8Data = encodeUtf8(rawData);
    
    qrCode.update({
      width: settings.size,
      height: settings.size,
      data: utf8Data,
      dotsOptions: {
        color: settings.fgColor,
        type: settings.dotsType as any
      },
      backgroundOptions: {
        color: settings.bgColor,
      },
      image: settings.logoUrl,
      imageOptions: {
        imageSize: settings.logoScale,
        hideBackgroundDots: settings.logoExcavate
      },
      qrOptions: {
        errorCorrectionLevel: settings.level
      }
    });

    if (qrRef.current) {
      const element = qrRef.current.querySelector('canvas, svg') as HTMLElement;
      if (element) {
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.maxWidth = '100%';
        element.style.objectFit = 'contain';
        element.style.display = 'block';
      }
    }
  }, [settings, qrCode]);

  const download = (format: 'png' | 'jpeg' | 'webp') => {
    const baseName = qrName?.trim().replace(/[/\\?%*:|"<>]/g, '-') || `vietqr-studio-${Date.now()}`;
    qrCode.download({ name: baseName, extension: format });
  };

  const downloadSVG = () => {
    const baseName = qrName?.trim().replace(/[/\\?%*:|"<>]/g, '-') || `vietqr-studio-${Date.now()}`;
    qrCode.download({ name: baseName, extension: 'svg' });
  };

  const copyToClipboard = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy image: ', err);
          }
        }
      });
    }
  };

  return (
    <div className="lg:sticky lg:top-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 flex flex-col items-center w-full">
      <div className="w-full flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.preview}</span>
        <div className="flex gap-2">
          {canSave && onSave && (
            // Fix: language is now accessible from props
            <button onClick={onSave} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title={language === 'en' ? 'Save History' : 'Lưu lịch sử'}>
              <Save className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => window.print()} className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative group mb-8 w-full max-w-[320px] aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-inner border border-gray-100 dark:border-white/5 overflow-hidden p-6">
        <div 
          ref={qrRef}
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {t.originalFile}: {settings.size}x{settings.size}px
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        <Button onClick={() => download('png')} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700">
          <Download className="w-4 h-4 mr-2" /> PNG
        </Button>
        <Button onClick={copyToClipboard} variant="secondary" className="w-full h-11 dark:bg-gray-800 dark:border-gray-700">
          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? t.copied : t.copy}
        </Button>
      </div>

      <Button onClick={downloadSVG} variant="outline" className="w-full h-11 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <FileCode className="w-4 h-4 mr-2" /> {t.downloadSvg}
      </Button>

      <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
        <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
          <strong>{t.utf8Title}:</strong> {t.utf8Desc}
        </p>
      </div>
    </div>
  );
};

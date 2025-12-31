
import React from 'react';
import { Button } from './Button';
import { X, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Cài đặt hệ thống</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              VIETQR Pro Studio đã được cấu hình tự động để sử dụng các dịch vụ AI từ Google Gemini.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 italic">
              Lưu ý: Khóa API được quản lý an toàn thông qua biến môi trường hệ thống.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Button onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
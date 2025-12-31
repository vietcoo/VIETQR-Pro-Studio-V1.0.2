
import { HistoryItem } from '../types';

const HISTORY_KEY = 'qr_pro_history_local';

export const historyService = {
  getHistory: (): HistoryItem[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading history", e);
      return [];
    }
  },

  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const history = historyService.getHistory();
    
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    // Thêm vào đầu danh sách, giới hạn 50 items mới nhất
    const newHistory = [newItem, ...history].slice(0, 50);
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Error saving history", e);
    }
    return newItem;
  },

  deleteItem: (itemId: string): HistoryItem[] => {
    const history = historyService.getHistory();
    const newHistory = history.filter(item => item.id !== itemId);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Error deleting item from history", e);
    }
    return newHistory;
  }
};

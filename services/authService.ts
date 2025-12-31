import { User } from '../types';

const USERS_KEY = 'qr_pro_users';
const CURRENT_USER_KEY = 'qr_pro_session';

// Giả lập độ trễ mạng
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(800); // Fake loading
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(800);
    const users = authService.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error("Email này đã được sử dụng.");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password // Lưu ý: Đây chỉ là demo client-side, thực tế không được lưu password raw
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser)); // Auto login
    
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
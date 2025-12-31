import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Cấu hình đường dẫn cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    title: "VIETQR Pro Studio",
    show: false, // Ẩn lúc đầu để tránh màn hình trắng
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Loại bỏ hoàn toàn thanh menu mặc định (File, Edit, View, Window, Help)
  mainWindow.removeMenu();
  // Hoặc dùng: Menu.setApplicationMenu(null); 

  // Tự động nhận diện môi trường
  const isDev = !app.isPackaged;

  if (isDev) {
    // Môi trường phát triển: Load từ Vite server
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      // Nếu Vite chưa chạy, nạp file từ dist làm dự phòng
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    });
  } else {
    // Môi trường Production: Nạp file từ thư mục dist đã được Vite build
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Chỉ hiện cửa sổ khi nội dung đã sẵn sàng
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      // mainWindow.webContents.openDevTools();
    }
  });

  // Xử lý khi cửa sổ bị đóng
  mainWindow.on('closed', () => {
    // Giải phóng bộ nhớ nếu cần
  });
}

// Khởi chạy ứng dụng
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Thoát khi tất cả cửa sổ đóng (ngoại trừ MacOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
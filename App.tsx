
import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { Button } from './components/Button';
import { QRScanner } from './components/QRScanner';
import { historyService } from './services/historyService';
import { generateVietQrString, BANKS } from './services/vietQrService';
import { QRSettings, QRType, WifiData, VCardData, VietQRData, HistoryItem, DotsType } from './types';
import { 
  Link as LinkIcon, Type, Wifi, Mail, 
  Contact, Palette, UploadCloud, X,
  Clock, Trash2, Sun, Moon, 
  Globe, Smartphone, Info,
  Coffee, CreditCard, Banknote, Building2, MousePointerClick,
  User as UserIcon, Layers, Maximize,
  Square, Circle, Diamond, LayoutGrid, Image as ImageIcon,
  ShieldCheck, Lock, HardDrive, Zap, CheckCircle2, Languages,
  Sparkles, Tag, ExternalLink, BookOpen, HelpCircle,
  QrCode, Shield, History, Download, Palette as PaletteIcon,
  Maximize2, Scan, Stars, AlertCircle, Eye, EyeOff
} from 'lucide-react';

const translations = {
  vi: {
    sidebar: {
      advanced: "Công cụ Nâng cao",
      basic: "Cơ bản",
      system: "Hệ thống",
      link: "Liên kết URL",
      text: "Văn bản thuần",
      vietqr: "Thanh toán VietQR",
      wifi: "Mạng WiFi",
      vcard: "Danh thiếp VCard",
      history: "Lịch sử tạo",
      guide: "Hướng dẫn",
      about: "Giới thiệu",
      scan: "Quét & Tái tạo QR"
    },
    header: {
      about: "Thông tin ứng dụng",
      guide: "Hướng dẫn sử dụng chi tiết",
      vietqr: "Chuyển tiền qua VietQR",
      history: "Lịch sử đã tạo",
      scan: "Trích xuất & Tái tạo thiết kế",
      default: "Trình tạo Mã QR Chuyên nghiệp"
    },
    common: {
      success: "Thành công!",
      saved: "Mã QR đã được lưu vào lịch sử của bạn.",
      preview: "XEM TRƯỚC",
      resolution: "Độ phân giải xuất ảnh",
      design: "Cấu hình Giao diện & Logo",
      colors: "Màu sắc hiển thị",
      fgColor: "Màu điểm (Foreground)",
      bgColor: "Màu nền (Background)",
      patterns: "Kiểu dáng điểm ảnh",
      errorCorrection: "Mức độ sửa lỗi (ECC)",
      logo: "Chèn logo doanh nghiệp",
      chooseLogo: "Chọn file Logo",
      logoScale: "Tỷ lệ Logo",
      standard: "Chuẩn",
      print: "In ấn",
      historyEmpty: "Chưa có lịch sử tạo mã.",
      selectHistory: "Chưa chọn mục lịch sử",
      selectHistoryDesc: "Chọn một mã từ danh sách bên trái để xem lại, chỉnh sửa hoặc tải xuống.",
      quickSuggest: "Gợi ý nhanh",
      confirmDelete: "Bạn có chắc chắn muốn xóa mã này khỏi lịch sử vĩnh viễn?",
      restoreAction: "Xem chi tiết & Chỉnh sửa",
      copy: "Sao chép",
      copied: "Đã sao chép",
      downloadSvg: "Tải SVG (Chất lượng cao nhất)",
      originalFile: "File gốc",
      utf8Title: "Chế độ UTF-8 Chuyên sâu",
      utf8Desc: "Ứng dụng đã được tối ưu để lưu trữ byte-stream UTF-8. Mã QR này đảm bảo quét đúng tiếng Việt trên Zalo, iOS Camera, Android Camera và các ứng dụng Ngân hàng.",
      eccLevels: {
        L: "Thấp (7%)",
        M: "Trung bình (15%)",
        Q: "Khá (25%)",
        H: "Cao (30%)"
      }
    },
    scanner: {
      title: "Quét & Tái tạo mã QR",
      desc: "Tải lên ảnh chứa mã QR để trích xuất nội dung và bắt đầu thiết kế lại ngay lập tức.",
      upload: "Chọn file ảnh",
      change: "Thay đổi",
      scanning: "Đang giải mã...",
      error: "Không tìm thấy mã QR trong ảnh này. Hãy thử ảnh rõ nét hơn.",
      results: "KẾT QUẢ TRÍCH XUẤT",
      action: "Đưa vào thiết kế",
      waiting: "Chờ tải ảnh...",
      tip: "Hỗ trợ định dạng: PNG, JPG, WEBP. Xử lý 100% Offline bảo mật.",
      note: "Lưu ý: Chức năng này hiện tại hoạt động tốt nhất cho Liên kết URL và Văn bản thuần."
    },
    forms: {
      qrNameLabel: "Tên mã QR (Tùy chọn)",
      qrNamePlaceholder: "Nhập tên gợi nhớ (VD: Wifi Cửa hàng, Chuyển tiền ăn trưa...)",
      urlLabel: "Nhập địa chỉ URL",
      bankLabel: "Chọn Ngân hàng",
      accountLabel: "Số tài khoản",
      amountLabel: "Số tiền (VND)",
      contentLabel: "Nội dung chuyển khoản",
      wifiSsid: "Tên WiFi (SSID)",
      wifiPass: "Mật khẩu",
      wifiSec: "Bảo mật",
      wifiOpen: "Mở",
      showPass: "Hiện mật khẩu",
      hidePass: "Ẩn mật khẩu",
      vcardSection1: "Thông tin cá nhân",
      vcardSection2: "Liên lạc",
      vcardSection3: "Công việc & Địa chỉ",
      vcardLastName: "Họ",
      vcardFirstName: "Tên",
      vcardPhone1: "Số điện thoại 1 (Cá nhân)",
      vcardPhone2: "Số điện thoại 2 (Công việc)",
      vcardEmail: "Địa chỉ Email",
      vcardUrl: "Trang web (URL)",
      vcardOrg: "Tên công ty / Tổ chức",
      vcardTitle: "Chức danh / Vị trí",
      vcardAddress: "Địa chỉ liên hệ",
      textPlaceholder: "Nhập nội dung...",
      placeholders: {
        accountNo: "Nhập số tài khoản ngân hàng...",
        amount: "Ví dụ: 50.000",
        content: "Nội dung chuyển tiền (không dấu)...",
        wifiSsid: "Tên WiFi hiển thị...",
        wifiPass: "Mật khẩu WiFi (nếu có)...",
        lastName: "VD: Nguyễn",
        firstName: "VD: Văn Việt",
        phone: "Số điện thoại liên hệ...",
        email: "example@gmail.com",
        org: "Tên cơ quan, doanh nghiệp...",
        title: "Chức danh công việc...",
        url: "https://website.com",
        address: "Địa chỉ đầy đủ..."
      }
    },
    guideContent: {
      badge: "Phiên bản V1.0.2 Studio",
      title: "Hướng dẫn sử dụng",
      subtitle: "Làm chủ công nghệ mã QR chuyên nghiệp chỉ trong vài phút. Theo dõi các bước đơn giản dưới đây để bắt đầu.",
      step1: {
        title: "1. Cách tạo mã QR",
        items: [
          "Chọn Loại dữ liệu mong muốn từ thanh menu bên trái (URL, Văn bản, VietQR, WiFi...).",
          "Nhập thông tin vào các trường tương ứng. Mã QR xem trước sẽ tự động cập nhật ngay lập tức.",
          "Nhấn biểu tượng Lưu (Save) ở khung xem trước để đưa mã vào danh sách Lịch sử."
        ]
      },
      step2: {
        title: "2. Tùy chỉnh & Thiết kế",
        items: [
          { bold: "Màu sắc:", text: "Luôn chọn màu điểm (Foreground) đậm hơn màu nền (Background) để tăng độ nhạy khi quét." },
          { bold: "Kiểu dáng:", text: "Thử các kiểu \"Rounded\" hoặc \"Dots\" để mã trông hiện đại hơn so với kiểu vuông truyền thống." },
          { bold: "Chèn Logo:", text: "Chọn logo rõ nét. Kích thước khuyến nghị là 15-20% để không làm mất dữ liệu quan trọng của mã." }
        ]
      },
      step3: {
        title: "3. Quản lý Lịch sử",
        desc: "Mọi mã QR bạn tạo đều được lưu an toàn tại tab Lịch sử.",
        items: [
          { bold: "Chỉnh sửa:", text: "Nhấn \"Xem chi tiết\" để nạp lại dữ liệu cũ và chỉnh sửa nhanh chóng." },
          { bold: "Xuất bản:", text: "Hỗ trợ tải định dạng PNG (cho web) và SVG (cho in ấn chất lượng cao)." }
        ]
      },
      step4: {
        title: "4. Bảo mật Offline",
        securityTitle: "Tuyệt đối riêng tư",
        securityDesc: "🔒 Ứng dụng này chạy hoàn toàn ngoại tuyến trên máy tính của bạn. Cam kết không thu thập, lưu trữ hay gửi bất kỳ dữ liệu cá nhân nào của bạn lên máy chủ.",
        note: "Lưu ý: Nếu bạn xóa dữ liệu trình duyệt hoặc gỡ ứng dụng, danh sách lịch sử có thể bị mất nếu không được sao lưu thủ công."
      },
      tipTitle: "Mẹo nhỏ",
      tipDesc: "Hãy sử dụng tính năng \"Tải SVG\" khi bạn cần in mã QR lên bao bì hoặc biển quảng cáo khổ lớn để đảm bảo độ sắc nét tuyệt đối!"
    },
    about: {
      heroTitle: "VIETQR Pro",
      heroDesc: "Giải pháp tạo mã QR thế hệ mới cho cá nhân và doanh nghiệp. Hỗ trợ in ấn chất lượng cao và hoàn toàn miễn phí.",
      noAds: "Đặc biệt QR được tạo từ phần mềm không chứa bất kỳ quảng cáo hay đường link lạ.",
      securityTitle: "Cam kết Bảo mật Tuyệt đối",
      securityDesc: "🔒 Ứng dụng này chạy hoàn toàn ngoại tuyến trên máy tính của bạn. Cam kết không thu thập, lưu trữ hay gửi bất kỳ dữ liệu cá nhân nào của bạn lên máy chủ.",
      devTitle: "Thông tin nhà phát triển",
      devName: "NGUYỄN VĂN VIỆT",
      devDesc: "Chuyên gia tư vấn giải pháp Bao Bì nhựa & Trục In Ống Đồng. Với nhiều năm kinh nghiệm chuyên sâu hoạt động trong lĩnh vực, Sứ mệnh của Việt là giúp các quý anh chị doanh nghiệp Thực phẩm, FMCG và Bán lẻ chuyển hóa bao bì thành một lợi thế cạnh tranh vượt trội trên thị trường!.",
      supportTitle: "MỜI TÔI MỘT LY CÀ PHÊ",
      supportDesc: "Duy trì dự án hoàn toàn miễn phí và không quảng cáo. Sự ủng hộ của bạn là động lực để tôi phát triển thêm nhiều tính năng mới.",
      footer: "© 2026 VIETQR Pro. All rights reserved. Designed for Windows Desktop."
    }
  },
  en: {
    sidebar: {
      advanced: "Advanced Tools",
      basic: "Basic",
      system: "System",
      link: "URL Link",
      text: "Plain Text",
      vietqr: "VietQR Payment",
      wifi: "WiFi Network",
      vcard: "VCard Contact",
      history: "History",
      guide: "User Guide",
      about: "About",
      scan: "Scan & Re-design"
    },
    header: {
      about: "App Information",
      guide: "Step-by-step Guide",
      vietqr: "Transfer via VietQR",
      history: "Creation History",
      scan: "Extract & Reproduce",
      default: "Professional QR Generator"
    },
    common: {
      success: "Success!",
      saved: "QR Code has been saved to your history.",
      preview: "PREVIEW",
      resolution: "Export Resolution",
      design: "UI & Logo Configuration",
      colors: "Display Colors",
      fgColor: "Dot Color (Foreground)",
      bgColor: "Background Color",
      patterns: "Pixel Styles",
      errorCorrection: "Error Correction Level (ECC)",
      logo: "Insert Brand Logo",
      chooseLogo: "Choose Logo File",
      logoScale: "Logo Scale",
      standard: "Standard",
      print: "Print",
      historyEmpty: "No history yet.",
      selectHistory: "No history item selected",
      selectHistoryDesc: "Select a code from the list on the left to review, edit or download.",
      quickSuggest: "Quick Suggest",
      confirmDelete: "Are you sure you want to delete this QR from history permanently?",
      restoreAction: "View Details & Edit",
      copy: "Copy",
      copied: "Copied",
      downloadSvg: "Download SVG (High Quality)",
      originalFile: "Original File",
      utf8Title: "Deep UTF-8 Mode",
      utf8Desc: "The application has been optimized for UTF-8 byte-stream storage. This QR code ensures correct Vietnamese decoding on Zalo, iOS Camera, Android Camera, and Banking apps.",
      eccLevels: {
        L: "Low (7%)",
        M: "Medium (15%)",
        Q: "Quartile (25%)",
        H: "High (30%)"
      }
    },
    scanner: {
      title: "Scan & Reproduce QR",
      desc: "Upload an image with a QR code to extract content and start redesigning immediately.",
      upload: "Choose Image File",
      change: "Change",
      scanning: "Decoding...",
      error: "No QR code found in this image. Please try a clearer one.",
      results: "EXTRACTION RESULTS",
      action: "Bring to Design",
      waiting: "Waiting for image...",
      tip: "Supports PNG, JPG, WEBP. 100% Offline & Secure.",
      note: "Note: This feature currently works best for URL Links and Plain Text."
    },
    forms: {
      qrNameLabel: "QR Code Name (Optional)",
      qrNamePlaceholder: "Enter a friendly name (e.g., Shop Wifi, Lunch Payment...)",
      urlLabel: "Enter URL Address",
      bankLabel: "Select Bank",
      accountLabel: "Account Number",
      amountLabel: "Amount (VND)",
      contentLabel: "Transfer Content",
      wifiSsid: "WiFi Name (SSID)",
      wifiPass: "Password",
      wifiSec: "Security",
      wifiOpen: "Open",
      showPass: "Show password",
      hidePass: "Hide password",
      vcardSection1: "Personal Information",
      vcardSection2: "Contact",
      vcardSection3: "Job & Address",
      vcardLastName: "Last Name",
      vcardFirstName: "First Name",
      vcardPhone1: "Phone 1 (Personal)",
      vcardPhone2: "Phone 2 (Work)",
      vcardEmail: "Email Address",
      vcardUrl: "Website (URL)",
      vcardOrg: "Company / Organization",
      vcardTitle: "Job Title / Position",
      vcardAddress: "Contact Address",
      textPlaceholder: "Enter content here...",
      placeholders: {
        accountNo: "Bank account number...",
        amount: "Ex: 100000",
        content: "Transfer details...",
        wifiSsid: "SSID name...",
        wifiPass: "Security key...",
        lastName: "Last name...",
        firstName: "First name...",
        phone: "Mobile or landline...",
        email: "john.doe@example.com",
        org: "Company name...",
        title: "Position...",
        url: "https://example.com",
        address: "Full address..."
      }
    },
    guideContent: {
      badge: "V1.0.2 Studio Build",
      title: "User Guide",
      subtitle: "Master professional QR technology in minutes. Follow these simple steps below to get started.",
      step1: {
        title: "1. How to create QR codes",
        items: [
          "Select the desired Data Type from the left menu (URL, Text, VietQR, WiFi...).",
          "Enter your information in the corresponding fields. The preview QR code will update instantly.",
          "Click the Save icon in the preview frame to add the code to your History list."
        ]
      },
      step2: {
        title: "2. Customization & Design",
        items: [
          { bold: "Colors:", text: "Always choose a dot color (Foreground) darker than the background color to increase scanning sensitivity." },
          { bold: "Patterns:", text: "Try \"Rounded\" or \"Dots\" styles to make the code look more modern than the traditional square style." },
          { bold: "Insert Logo:", text: "Choose a clear logo. Recommended size is is 15-20% to avoid losing important code data." }
        ]
      },
      step3: {
        title: "3. History Management",
        desc: "Every QR code you create is securely saved in the History tab.",
        items: [
          { bold: "Editing:", text: "Click \"View Details\" to reload old data and edit it quickly." },
          { bold: "Exporting:", text: "Support downloading in PNG format (for web) and SVG (for high-quality printing)." }
        ]
      },
      step4: {
        title: "4. Offline Security",
        securityTitle: "Absolute Privacy",
        securityDesc: "The application does not use Cloud. All your data stays on your own computer.",
        note: "Note: If you clear browser data or uninstall the app, your history list may be lost if not backed up manually."
      },
      tipTitle: "Pro Tip",
      tipDesc: "Use the \"Download SVG\" feature when you need to print QR codes on packaging or large billboards to ensure absolute sharpness!"
    },
    about: {
      heroTitle: "VIETQR Pro",
      heroDesc: "Next-gen QR solution for individuals and businesses. High-quality print support and completely free.",
      noAds: "Special: QR codes generated by the software contain no ads or suspicious links.",
      securityTitle: "Absolute Security Commitment",
      securityDesc: "🔒 This app runs 100% offline on your computer. We commit not to collect, store, or send any of your personal data to servers.",
      devTitle: "Developer Information",
      devName: "NGUYEN VAN VIET",
      devDesc: "Plastic Packaging & Gravure Printing solution consultant. With years of deep experience, Viet's mission is to help Food, FMCG, and Retail businesses transform packaging into a competitive advantage!.",
      supportTitle: "BUY ME A COFFEE",
      supportDesc: "Keep the project free and ad-free. Your support is the motivation for me to develop new features.",
      footer: "© 2026 VIETQR Pro. All rights reserved. Designed for Windows Desktop."
    }
  }
};

const DEFAULT_SETTINGS: QRSettings = {
  value: 'https://vietshareprintpack.com',
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 1000, 
  level: 'M',
  includeMargin: true,
  logoScale: 0.15,
  logoExcavate: true,
  dotsType: 'square'
};

const MiniQR = ({ value, color }: { value: string; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const qrCode = new QRCodeStyling({
      width: 256,
      height: 256,
      data: value,
      dotsOptions: { color: color, type: 'square' },
      backgroundOptions: { color: '#ffffff' },
      qrOptions: { errorCorrectionLevel: 'H' }
    });
    ref.current.innerHTML = '';
    qrCode.append(ref.current);
    const canvas = ref.current.querySelector('canvas');
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
  }, [value, color]);

  return (
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
      <div ref={ref} className="w-28 h-28 flex items-center justify-center overflow-hidden" />
    </div>
  );
};

export function App() {
  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'vi' || saved === 'en') ? saved : 'vi';
  });
  const t = translations[language];

  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);
  const [activeType, setActiveType] = useState<QRType>('LINK');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [qrName, setQrName] = useState('');
  const [link, setLink] = useState('https://vietshareprintpack.com');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState<WifiData>({ ssid: '', password: '', encryption: 'WPA', hidden: false });
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [vcard, setVcard] = useState<VCardData>({ 
    firstName: '', lastName: '', phone: '', phoneSecondary: '',
    email: '', org: '', title: '', url: '', address: ''
  });
  const [vietqr, setVietqr] = useState<VietQRData>({ bankBin: '970436', accountNo: '', amount: '', content: '' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    setHistoryItems(historyService.getHistory());
  }, []);

  const isRestoringRef = useRef(false);

  const escapeVCard = (v: string) => {
    if (!v) return '';
    return v.replace(/([\\;,:])/g, '\\$1').replace(/\n/g, '\\n');
  };

  useEffect(() => {
    if (activeType === 'HISTORY' || activeType === 'ABOUT' || activeType === 'GUIDE' || activeType === 'SCAN' || isRestoringRef.current) return;

    let val = '';

    switch (activeType) {
      case 'LINK': 
        val = link; 
        break;
      case 'TEXT': 
        val = text; 
        break;
      case 'WIFI': 
        val = `WIFI:T:${wifi.encryption};S:${escapeVCard(wifi.ssid)};P:${escapeVCard(wifi.password)};H:${wifi.hidden};;`; 
        break;
      case 'VIETQR': 
        val = generateVietQrString(vietqr.bankBin, vietqr.accountNo, vietqr.amount, vietqr.content);
        break;
      case 'TEL': 
        val = `tel:${vcard.phone}`; 
        break;
      case 'VCARD': 
        val = `BEGIN:VCARD\nVERSION:3.0\n`;
        val += `N;CHARSET=UTF-8:${escapeVCard(vcard.lastName)};${escapeVCard(vcard.firstName)};;;\n`;
        val += `FN;CHARSET=UTF-8:${escapeVCard(vcard.firstName)} ${escapeVCard(vcard.lastName)}\n`;
        if (vcard.org) val += `ORG;CHARSET=UTF-8:${escapeVCard(vcard.org)}\n`;
        if (vcard.title) val += `TITLE;CHARSET=UTF-8:${escapeVCard(vcard.title)}\n`;
        if (vcard.phone) val += `TEL;TYPE=CELL:${vcard.phone}\n`;
        if (vcard.phoneSecondary) val += `TEL;TYPE=WORK:${vcard.phoneSecondary}\n`;
        if (vcard.email) val += `EMAIL;TYPE=INTERNET:${vcard.email}\n`;
        if (vcard.url) val += `URL:${vcard.url}\n`;
        if (vcard.address) val += `ADR;TYPE=WORK;CHARSET=UTF-8:;;${escapeVCard(vcard.address)};;;;\n`;
        val += `END:VCARD`;
        break;
    }
    
    if (val) setSettings(prev => ({ ...prev, value: val }));
  }, [activeType, link, text, wifi, vcard, vietqr]);

  const handleReproduce = (content: string) => {
    isRestoringRef.current = true;
    
    if (content.startsWith('000201')) {
      setActiveType('VIETQR');
      const binMatch = content.match(/38\d{2}.*01\d{2}0006(\d{6})/);
      const accMatch = content.match(/38\d{2}.*01\d{2}.*01(\d{2})(\w+)/);
      const amountMatch = content.match(/54(\d{2})(\d+)/);
      
      setVietqr({
        bankBin: binMatch ? binMatch[1] : '970436',
        accountNo: accMatch ? accMatch[2].substring(0, parseInt(accMatch[1])) : '',
        amount: amountMatch ? amountMatch[2] : '',
        content: '' 
      });
    } else if (content.startsWith('http')) {
      setActiveType('LINK');
      setLink(content);
    } else if (content.startsWith('WIFI:')) {
      setActiveType('WIFI');
      const ssid = content.match(/S:([^;]+);/)?.[1] || '';
      const pass = content.match(/P:([^;]+);/)?.[1] || '';
      const enc = content.match(/T:([^;]+);/)?.[1] || 'WPA';
      setWifi({ ssid, password: pass, encryption: enc as any, hidden: false });
    } else if (content.startsWith('BEGIN:VCARD')) {
      setActiveType('VCARD');
      const fn = content.match(/FN(?:;CHARSET=UTF-8)?:([^ \n\r]+)/)?.[1] || '';
      const tel = content.match(/TEL(?:;TYPE=\w+)?:([^ \n\r]+)/)?.[1] || '';
      setVcard({ ...vcard, firstName: fn, phone: tel });
    } else {
      setActiveType('TEXT');
      setText(content);
    }

    setSettings({ ...settings, value: content });
    
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 50);
  };

  const handleSaveToHistory = () => {
    const defaultName = activeType === 'WIFI' ? `Wifi: ${wifi.ssid}` : 
                 activeType === 'VIETQR' ? `${language === 'vi' ? 'Thanh toán' : 'Payment'}: ${vietqr.accountNo}` :
                 activeType === 'VCARD' ? `${vcard.firstName} ${vcard.lastName}` : settings.value.substring(0, 20);
    
    const finalName = qrName.trim() || defaultName || (language === 'vi' ? 'QR Không tên' : 'Unnamed QR');

    const newItem = historyService.addToHistory({
      type: activeType,
      name: finalName,
      value: settings.value,
      settings,
      formData: { link, text, wifi, vcard, vietqr, qrName }
    });
    
    setHistoryItems(prev => [newItem, ...prev]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePreviewHistoryItem = (item: HistoryItem) => {
    setSettings(item.settings);
    setSelectedHistoryId(item.id);
  };

  const handleEditHistoryItem = (item: HistoryItem) => {
    isRestoringRef.current = true;
    setSettings(item.settings);
    const data = item.formData;
    if (data) {
      if (data.qrName !== undefined) setQrName(data.qrName);
      if (data.link !== undefined) setLink(data.link);
      if (data.text !== undefined) setText(data.text);
      if (data.wifi) setWifi(data.wifi);
      if (data.vcard) setVcard(data.vcard);
      if (data.vietqr) setVietqr(data.vietqr);
    }
    setSelectedHistoryId(item.id);
    setActiveType(item.type);
    setTimeout(() => { isRestoringRef.current = false; }, 50);
  };

  const SidebarItem = ({ type, icon, label, color = 'indigo' }: { type: QRType, icon: any, label: string, color?: string }) => (
    <button
      onClick={() => setActiveType(type)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        activeType === type 
          ? `bg-${color}-600 text-white shadow-lg shadow-${color}-200 dark:shadow-none` 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {React.createElement(icon, { className: "w-4 h-4" })}
      <span>{label}</span>
    </button>
  );

  const formatVietnameseCurrency = (val: string) => {
    if (!val) return '';
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const isHistoryTab = activeType === 'HISTORY';
  const isFullWidthTab = activeType === 'ABOUT' || activeType === 'GUIDE' || activeType === 'SCAN';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{t.common.success}</p>
            <p className="text-xs opacity-90">{t.common.saved}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <span className="font-bold text-lg dark:text-white">VIETQR <span className="text-indigo-600">Pro</span></span>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          <p className="px-4 text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Stars className="w-3 h-3" /> {t.sidebar.advanced}
          </p>
          <SidebarItem type="SCAN" icon={Scan} label={t.sidebar.scan} color="amber" />
          
          <div className="my-4 border-t border-gray-50 dark:border-gray-800" />
          
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.sidebar.basic}</p>
          <SidebarItem type="LINK" icon={LinkIcon} label={t.sidebar.link} />
          <SidebarItem type="TEXT" icon={Type} label={t.sidebar.text} />
          <SidebarItem type="VIETQR" icon={Banknote} label={t.sidebar.vietqr} color="emerald" />
          <SidebarItem type="WIFI" icon={Wifi} label={t.sidebar.wifi} />
          <SidebarItem type="VCARD" icon={Contact} label={t.sidebar.vcard} />
          
          <div className="my-4 border-t border-gray-100 dark:border-gray-800" />
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.sidebar.system}</p>
          <SidebarItem type="HISTORY" icon={Clock} label={t.sidebar.history} color="gray" />
          <SidebarItem type="GUIDE" icon={BookOpen} label={t.sidebar.guide} color="indigo" />
          <SidebarItem type="ABOUT" icon={Info} label={t.sidebar.about} color="gray" />
        </nav>

        <div className="mt-auto pt-4 flex gap-2">
           <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
             <div className="flex items-center gap-2">
               <Languages className="w-4 h-4" />
               <span className="text-xs font-bold uppercase">{language}</span>
             </div>
           </button>
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
             {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
           <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
             {activeType === 'ABOUT' ? t.header.about : 
              activeType === 'GUIDE' ? t.header.guide :
              activeType === 'VIETQR' ? t.header.vietqr : 
              activeType === 'SCAN' ? t.header.scan :
              activeType === 'HISTORY' ? t.header.history : t.header.default}
           </h1>
           <div className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{t.guideContent.badge}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className={`${isFullWidthTab ? 'max-w-6xl' : 'max-w-5xl'} mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start`}>
            
            <div className={`${isFullWidthTab ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-6`}>
              
              {activeType === 'SCAN' && (
                <QRScanner onScanSuccess={handleReproduce} t={t.scanner} />
              )}

              {activeType === 'GUIDE' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen className="w-48 h-48" /></div>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black mb-4 flex items-center gap-4"><HelpCircle className="w-10 h-10" /> {t.guideContent.title}</h2>
                      <p className="text-indigo-100 text-lg max-w-2xl font-medium">{t.guideContent.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6"><QrCode className="w-6 h-6" /></div>
                      <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-tight">{t.guideContent.step1.title}</h3>
                      <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-medium">
                        {t.guideContent.step1.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{String(idx + 1).padStart(2, '0')}</div> 
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><PaletteIcon className="w-6 h-6" /></div>
                      <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-tight">{t.guideContent.step2.title}</h3>
                      <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-medium">
                        {t.guideContent.step2.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            < Zap className="w-4 h-4 text-amber-500 shrink-0 mt-1" /> 
                            <span><b>{item.bold}</b> {item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><History className="w-6 h-6" /></div>
                      <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-tight">{t.guideContent.step3.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium leading-relaxed">{t.guideContent.step3.desc}</p>
                      <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-medium">
                        {t.guideContent.step3.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            {idx === 0 ? <ExternalLink className="w-4 h-4 text-indigo-500" /> : <Download className="w-4 h-4 text-indigo-500" />}
                            <span><b>{item.bold}</b> {item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 mb-6"><Shield className="w-6 h-6" /></div>
                      <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-tight">{t.guideContent.step4.title}</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                          <p className="text-red-900 dark:text-red-300 text-sm font-bold flex items-center gap-2"><Lock className="w-4 h-4" /> {t.guideContent.step4.securityTitle}</p>
                          <p className="text-red-800/80 dark:text-red-400/80 text-xs mt-1 font-medium">{t.guideContent.step4.securityDesc}</p>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs italic font-medium">{t.guideContent.step4.note}</p>
                      </div>
                    </section>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-200 dark:border-amber-900/30 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-amber-500 shrink-0"><Sparkles className="w-8 h-8" /></div>
                    <div>
                      <h4 className="text-amber-900 dark:text-amber-400 font-black uppercase text-xs tracking-widest mb-1">{t.guideContent.tipTitle}</h4>
                      <p className="text-amber-800 dark:text-amber-300 font-bold">{t.guideContent.tipDesc}</p>
                    </div>
                  </div>
                  <div className="text-center py-10"><p className="text-gray-400 dark:text-gray-600 text-xs font-medium">{t.about.footer}</p></div>
                </div>
              )}

              {activeType === 'ABOUT' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <section className="relative overflow-hidden bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                      <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl shrink-0">V</div>
                      <div className="space-y-3 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <h2 className="text-4xl font-black text-gray-900 dark:text-white">{t.about.heroTitle}</h2>
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">{t.guideContent.badge}</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
                          {t.about.heroDesc} <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">{t.about.noAds}</span>
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-5">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0"><ShieldCheck className="w-8 h-8" /></div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">{t.about.securityTitle}</h3>
                        <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed font-medium">{t.about.securityDesc}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center items-center text-center gap-3">
                       <HardDrive className="w-8 h-8 text-blue-600" />
                       <span className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase">100% Offline Mode</span>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-lg space-y-8">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2"><UserIcon className="w-4 h-4 text-indigo-500" /> {t.about.devTitle}</h3>
                       <div className="space-y-4">
                         <h4 className="text-2xl font-black dark:text-white">{t.about.devName}</h4>
                         <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{t.about.devDesc}</p>
                       </div>
                       <div className="grid grid-cols-1 gap-3">
                          <a href="https://vietshareprintpack.com" target="_blank" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100 group">
                             <Globe className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                             <span className="text-sm font-bold dark:text-gray-200">vietshareprintpack.com</span>
                          </a>
                          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent">
                             <Smartphone className="w-5 h-5 text-emerald-600" />
                             <span className="text-sm font-bold dark:text-gray-200">Hotline: 0963.425.013</span>
                          </div>
                          <a href="mailto:vietsharevn.contact@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 group">
                             <Mail className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                             <span className="text-sm font-bold dark:text-gray-200">vietsharevn.contact@gmail.com</span>
                          </a>
                       </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 flex flex-col relative overflow-hidden">
                       <div className="absolute top-0 right-0 opacity-10 -mr-8 -mt-8 rotate-12"><Coffee className="w-40 h-40" /></div>
                       <h3 className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">< Coffee className="w-4 h-4" /> {t.about.supportTitle}</h3>
                       <p className="text-amber-900/80 dark:text-amber-300/80 mb-8 flex-1">{t.about.supportDesc}</p>
                       <div className="space-y-4">
                          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/50 flex items-center justify-between gap-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center text-pink-600"><Smartphone className="w-5 h-5" /></div>
                               <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase">Momo</p>
                                 <p className="text-sm font-black dark:text-white">0963.425.013</p>
                               </div>
                             </div>
                             <MiniQR value="https://nhantien.momo.vn/0963425013" color="#000000" />
                          </div>
                          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/50 flex items-center justify-between gap-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600"><CreditCard className="w-5 h-5" /></div>
                               <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase">Techcombank</p>
                                 <p className="text-sm font-black dark:text-white">6600000079</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-3">
                               <span className="hidden md:block text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">NGUYEN VAN VIET</span>
                               <MiniQR value={generateVietQrString('970407', '6600000079', '', 'Ung ho du an VIETQR Pro')} color="#000000" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="text-center pb-10"><p className="text-gray-400 dark:text-gray-600 text-xs font-medium">{t.about.footer}</p></div>
                </div>
              )}

              {!isHistoryTab && !isFullWidthTab && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 space-y-6">
                    <div className="pb-4 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                        <Tag className="w-3 h-3 text-indigo-500" /> {t.forms.qrNameLabel}
                      </label>
                      <input 
                        type="text" 
                        value={qrName}
                        onChange={e => setQrName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                        placeholder={t.forms.qrNamePlaceholder}
                      />
                    </div>

                    {activeType === 'LINK' && (
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold">{t.forms.urlLabel}</label>
                        <input type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="https://example.com" />
                      </div>
                    )}
                    {activeType === 'VIETQR' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.bankLabel}</label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <select value={vietqr.bankBin} onChange={e => setVietqr({...vietqr, bankBin: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:bg-gray-900">
                                {BANKS.map(bank => <option key={bank.bin} value={bank.bin}>{bank.name}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.accountLabel}</label>
                            <input type="text" value={vietqr.accountNo} onChange={e => setVietqr({...vietqr, accountNo: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t.forms.placeholders.accountNo} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.amountLabel}</label>
                            <input type="text" inputMode="numeric" value={formatVietnameseCurrency(vietqr.amount)} onChange={e => setVietqr({...vietqr, amount: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-emerald-500 font-bold" placeholder={t.forms.placeholders.amount} />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.contentLabel}</label>
                            <input type="text" value={vietqr.content} onChange={e => setVietqr({...vietqr, content: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-emerald-500" placeholder={t.forms.placeholders.content} />
                          </div>
                        </div>
                      </div>
                    )}
                    {activeType === 'VCARD' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2"><p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 border-b border-indigo-50 dark:border-indigo-900/30 pb-1">{t.forms.vcardSection1}</p></div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">{t.forms.vcardLastName} <span className="text-red-500">*</span></label>
                            <input type="text" value={vcard.lastName} onChange={e => setVcard({...vcard, lastName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.lastName} required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">{t.forms.vcardFirstName} <span className="text-red-500">*</span></label>
                            <input type="text" value={vcard.firstName} onChange={e => setVcard({...vcard, firstName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.firstName} required />
                          </div>
                          <div className="md:col-span-2 mt-2"><p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 border-b border-indigo-50 dark:border-indigo-900/30 pb-1">{t.forms.vcardSection2}</p></div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardPhone1}</label>
                            <input type="tel" value={vcard.phone} onChange={e => setVcard({...vcard, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.phone} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardPhone2}</label>
                            <input type="tel" value={vcard.phoneSecondary} onChange={e => setVcard({...vcard, phoneSecondary: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.phone} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardEmail}</label>
                            <input type="email" value={vcard.email} onChange={e => setVcard({...vcard, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.email} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardUrl}</label>
                            <input type="url" value={vcard.url} onChange={e => setVcard({...vcard, url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.url} />
                          </div>
                          <div className="md:col-span-2 mt-2"><p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 border-b border-indigo-50 dark:border-indigo-900/30 pb-1">{t.forms.vcardSection3}</p></div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardOrg}</label>
                            <input type="text" value={vcard.org} onChange={e => setVcard({...vcard, org: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.org} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardTitle}</label>
                            <input type="text" value={vcard.title} onChange={e => setVcard({...vcard, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.placeholders.title} />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t.forms.vcardAddress}</label>
                            <textarea rows={2} value={vcard.address} onChange={e => setVcard({...vcard, address: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder={t.forms.placeholders.address} />
                          </div>
                        </div>
                      </div>
                    )}
                    {activeType === 'WIFI' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1">{t.forms.wifiSsid}</label>
                            <input type="text" value={wifi.ssid} onChange={e => setWifi({...wifi, ssid: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-transparent" placeholder={t.forms.placeholders.wifiSsid} />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">{t.forms.wifiPass}</label>
                            <div className="relative">
                              <input 
                                type={showWifiPassword ? 'text' : 'password'} 
                                value={wifi.password} 
                                onChange={e => setWifi({...wifi, password: e.target.value})} 
                                className="w-full pl-4 pr-10 py-2 rounded-lg border dark:border-gray-700 bg-transparent" 
                                placeholder={t.forms.placeholders.wifiPass} 
                              />
                              <button 
                                type="button"
                                onClick={() => setShowWifiPassword(!showWifiPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                title={showWifiPassword ? t.forms.hidePass : t.forms.showPass}
                              >
                                {showWifiPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">{t.forms.wifiSec}</label>
                            <select value={wifi.encryption} onChange={e => setWifi({...wifi, encryption: e.target.value as any})} className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-transparent dark:bg-gray-900">
                              <option value="WPA">WPA/WPA2</option>
                              <option value="nopass">{t.forms.wifiOpen}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeType === 'TEXT' && (
                      <textarea rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t.forms.textPlaceholder} />
                    )}
                  </div>
                </div>
              )}

              {isHistoryTab && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  {historyItems.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center gap-4">
                      <Clock className="w-12 h-12 text-gray-200 dark:text-gray-800" />
                      <p className="text-sm text-gray-400 italic">{t.common.historyEmpty}</p>
                    </div>
                  ) : (
                    historyItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => handlePreviewHistoryItem(item)} 
                        className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${selectedHistoryId === item.id ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/40 ring-2 ring-indigo-500 shadow-lg' : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-indigo-200 dark:hover:border-indigo-900'}`}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedHistoryId === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            {item.type === 'LINK' && <LinkIcon className="w-5 h-5" />}
                            {item.type === 'VIETQR' && <Banknote className="w-5 h-5" />}
                            {item.type === 'WIFI' && <Wifi className="w-5 h-5" />}
                            {item.type === 'VCARD' && <Contact className="w-5 h-5" />}
                            {item.type === 'TEXT' && <Type className="w-5 h-5" />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-bold line-clamp-1 transition-colors ${selectedHistoryId === item.id ? 'text-indigo-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{item.name}</h4>
                              <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded border dark:border-gray-700">
                                {item.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleString(language, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditHistoryItem(item);
                                }}
                                className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-bold transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" /> {t.common.restoreAction}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 relative z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(t.common.confirmDelete)) {
                                const updatedHistory = historyService.deleteItem(item.id);
                                setHistoryItems(updatedHistory);
                                if (selectedHistoryId === item.id) setSelectedHistoryId(null);
                              }
                            }} 
                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        {selectedHistoryId === item.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {!isHistoryTab && !isFullWidthTab && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2"><Palette className="w-5 h-5 text-indigo-600" /><h2 className="font-bold text-gray-800 dark:text-white">{t.common.design}</h2></div>
                  <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><LayoutGrid className="w-3 h-3" /> {t.common.colors}</label>
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <span className="text-[10px] text-gray-500 font-bold block">{t.common.fgColor}</span>
                            <div className="flex items-center gap-2 p-1.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                              <input type="color" value={settings.fgColor} onChange={e => setSettings({...settings, fgColor: e.target.value})} className="w-8 h-8 rounded border-none cursor-pointer" />
                              <span className="text-xs font-mono uppercase dark:text-gray-300">{settings.fgColor}</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <span className="text-[10px] text-gray-500 font-bold block">{t.common.bgColor}</span>
                            <div className="flex items-center gap-2 p-1.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                              <input type="color" value={settings.bgColor} onChange={e => setSettings({...settings, bgColor: e.target.value})} className="w-8 h-8 rounded border-none cursor-pointer" />
                              <span className="text-xs font-mono uppercase dark:text-gray-300">{settings.bgColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> {t.common.patterns}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[{ id: 'square', icon: Square, label: language === 'vi' ? 'Vuông' : 'Square' }, { id: 'dots', icon: Circle, label: language === 'vi' ? 'Tròn' : 'Dots' }, { id: 'classy', icon: Diamond, label: language === 'vi' ? 'Thoi' : 'Diamond' }, { id: 'rounded', icon: LayoutGrid, label: language === 'vi' ? 'Bo góc' : 'Rounded' }].map((pattern) => (
                            <button key={pattern.id} onClick={() => setSettings({...settings, dotsType: pattern.id as DotsType})} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${settings.dotsType === pattern.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 dark:text-gray-400'}`}><pattern.icon className="w-5 h-5 mb-1" /><span className="text-[9px] font-bold">{pattern.label}</span></button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3 h-3 text-indigo-500" /> {t.common.errorCorrection}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setSettings({ ...settings, level: lvl })}
                            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all ${
                              settings.level === lvl 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' 
                                : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 dark:text-gray-400'
                            }`}
                          >
                            <span className="text-[11px] font-black">{lvl}</span>
                            <span className="text-[9px] font-medium opacity-80">{t.common.eccLevels[lvl]}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 italic">
                        {language === 'vi' 
                          ? '* Cấp độ cao (H) giúp mã vẫn hoạt động tốt khi bị che khuất bởi Logo.' 
                          : '* High level (H) ensures the code works even when partially covered by a Logo.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Maximize className="w-3 h-3" /> {t.common.resolution}</label><span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">{settings.size}px</span></div>
                        <div className="space-y-4">
                          <input type="range" min="200" max="2000" step="100" value={settings.size} onChange={e => setSettings({...settings, size: parseInt(e.target.value)})} className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-tighter"><span>Web (200px)</span><span>{t.common.standard} (1000px)</span><span>{t.common.print} (2000px)</span></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><UploadCloud className="w-3 h-3" /> {t.common.logo}</label>
                        {!settings.logoUrl ? (
                          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"><ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" /><span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-indigo-600">{t.common.chooseLogo}</span></div>
                        ) : (
                          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border dark:border-gray-700"><div className="bg-white p-1 rounded-lg border shadow-sm"><img src={settings.logoUrl} className="w-8 h-8 object-contain" /></div><div className="flex-1"><div className="flex justify-between text-[9px] font-bold mb-1 uppercase text-gray-400">{t.common.logoScale} <span>{Math.round(settings.logoScale * 100)}%</span></div><input type="range" min="0.1" max="0.4" step="0.01" value={settings.logoScale} onChange={e => setSettings({...settings, logoScale: parseFloat(e.target.value)})} className="w-full h-1 bg-gray-200 accent-indigo-600 rounded-lg appearance-none cursor-pointer" /></div><button onClick={() => setSettings({...settings, logoUrl: undefined})} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"><X className="w-4 h-4" /></button></div>
                        )}
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => {const file = e.target.files?.[0]; if (file) {const reader = new FileReader(); reader.onload = (e) => setSettings({...settings, logoUrl: e.target?.result as string}); reader.readAsDataURL(file);}}} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isFullWidthTab && (
              <div className="lg:col-span-5 lg:sticky lg:top-8 animate-in slide-in-from-right-4 duration-500">
                {isHistoryTab && !selectedHistoryId ? (
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center h-[500px] shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <MousePointerClick className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                    </div>
                    <h3 className="text-lg font-bold dark:text-white">{t.common.selectHistory}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">{t.common.selectHistoryDesc}</p>
                  </div>
                ) : (
                  <QRCodeDisplay settings={settings} onSave={handleSaveToHistory} canSave={!isHistoryTab} qrName={qrName} t={t.common} language={language} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

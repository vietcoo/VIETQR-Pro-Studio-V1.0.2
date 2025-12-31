
export type QRType = 'LINK' | 'TEXT' | 'WIFI' | 'VIETQR' | 'VCARD' | 'TEL' | 'HISTORY' | 'ABOUT' | 'GUIDE' | 'SCAN';

export type DotsType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface QRSettings {
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  logoUrl?: string;
  logoScale: number;
  logoExcavate: boolean;
  dotsType: DotsType;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: QRType;
  name: string;
  value: string;
  settings: QRSettings;
  formData: any;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VietQRData {
  bankBin: string;
  accountNo: string;
  amount: string;
  content: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  org: string;
  title: string;
  url: string;
  address?: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

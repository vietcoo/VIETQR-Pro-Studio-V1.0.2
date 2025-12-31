
function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function f(id: string, value: string): string {
  if (!value) return '';
  return id + value.length.toString().padStart(2, '0') + value;
}

/**
 * Tạo chuỗi VietQR chuẩn NAPAS 2.0 (EMVCo)
 */
export const generateVietQrString = (bankBin: string, accountNo: string, amount: string, content: string): string => {
  // 1. Merchant Account Information (ID 38)
  const guid = f('00', 'A000000727'); // NAPAS GUID
  
  // Tag 01: Beneficiary ID (Chứa 00: Mã BIN và 01: Số tài khoản)
  const beneficiaryInfo = f('00', bankBin) + f('01', accountNo);
  const beneficiary = f('01', beneficiaryInfo);
  
  // Tag 02: Service Code (QRIBFTTA cho chuyển tiền qua STK)
  const serviceCode = f('02', 'QRIBFTTA');
  
  const paymentService = guid + beneficiary + serviceCode;
  const consumerAccountInfo = f('38', paymentService);

  // 2. Các tag khác trong payload
  // 00: Payload Format Indicator (01)
  // 01: Point of Initiation Method (11: Tĩnh, 12: Động)
  let payload = '000201' + (amount ? '010212' : '010211');
  
  payload += consumerAccountInfo;
  
  // 52: Merchant Category Code (0000 - General)
  payload += '52040000';
  
  // 53: Transaction Currency (704 là mã VNĐ)
  payload += '5303704'; 
  
  // 54: Transaction Amount
  if (amount) {
    payload += f('54', amount);
  }
  
  // 58: Country Code (VN)
  payload += '5802VN'; 
  
  // 62: Additional Data Field Template
  if (content) {
    // Tag 08: Purpose of Transaction (Nội dung chuyển khoản)
    // Loại bỏ dấu tiếng Việt để tránh lỗi trên một số ứng dụng ngân hàng cũ
    const cleanContent = content.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    const additionalData = f('08', cleanContent);
    payload += f('62', additionalData);
  }

  // 63: CRC (4 ký tự cuối cùng)
  payload += '6304'; 
  
  return payload + crc16(payload);
};

export const BANKS = [
  { name: 'Vietcombank', bin: '970436' },
  { name: 'Techcombank', bin: '970407' },
  { name: 'MBBank', bin: '970422' },
  { name: 'BIDV', bin: '970418' },
  { name: 'Agribank', bin: '970405' },
  { name: 'VietinBank', bin: '970415' },
  { name: 'TPBank', bin: '970423' },
  { name: 'ACB', bin: '970416' },
  { name: 'VPBank', bin: '970432' },
  { name: 'Sacombank', bin: '970403' },
  { name: 'HDBank', bin: '970437' },
  { name: 'VIB', bin: '970441' },
];

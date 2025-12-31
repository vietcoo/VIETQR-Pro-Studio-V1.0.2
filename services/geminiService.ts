
import { GoogleGenAI, Type } from "@google/genai";

export const generateSmartQRContent = async (userInput: string): Promise<{ content: string; type: string; summary: string } | null> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: `Bạn là chuyên gia về Mã QR. Phân tích yêu cầu và trả về định dạng chuẩn:
        - WIFI: WIFI:T:WPA;S:SSID;P:PASS;H:false;;
        - EMAIL: mailto:a@b.com?subject=X&body=Y
        - SMS: SMSTO:NUM:MSG
        - TEL: tel:NUM
        - VCARD: BEGIN:VCARD\nVERSION:3.0\nN:Last;First\nFN:Full Name\nTEL:Num\nEND:VCARD
        - URL: https://...
        Trả về JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "Chuỗi mã QR thực tế" },
            type: { type: Type.STRING, description: "Loại (WIFI, URL, VCARD, v.v.)" },
            summary: { type: Type.STRING, description: "Mô tả ngắn gọn bằng tiếng Việt về mã đã tạo" }
          },
          required: ["content", "type", "summary"]
        }
      },
    });

    // Access .text property directly (not a method)
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Không thể xử lý yêu cầu AI vào lúc này.");
  }
};
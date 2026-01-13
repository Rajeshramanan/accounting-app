import { GoogleGenAI, Type } from "@google/genai";
import type { Ledger, StockItem, AIAnalysisResponse } from '../types';

// FIX: Use Vite's import.meta.env for browser compatibility.
// process.env will cause the app to crash.
const apiKey = (import.meta as any).env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeTransaction = async (
  inputText: string, 
  ledgers: Ledger[], 
  stock: StockItem[],
  imagePart?: { inlineData: { data: string, mimeType: string } }
): Promise<AIAnalysisResponse> => {
  
  const ledgerNames = ledgers.map(l => l.name).join(", ");
  const stockItems = stock.map(s => `${s.name} (${s.unit}) @ ${s.rate}`).join(", ");

  const systemPrompt = `
    You are an advanced AI Accounting Engine for 'RS Traders & Co'.
    Your role is to simulate a Chartered Accountant and Tally Expert.
    
    Current Business Context:
    - Branches: Head Office – Coimbatore, Branch Office – Tiruppur
    - Available Ledgers: ${ledgerNames}
    - Available Stock: ${stockItems}
    
    Task:
    Analyze the user provided transaction text (receipt/invoice/note) and/or image.
    1. Extract Date, Amount, Product, Quantity, Tax.
    2. Identify the Voucher Type (Sales, Purchase, Payment, Receipt, Contra, Journal).
    3. Match with existing ledgers strictly. If a specific customer/vendor name is used, map it to 'Accounts Receivable' or 'Accounts Payable' if a specific ledger doesn't exist, but mention the specific name in the narration.
    4. Determine Debit/Credit logic based on Double Entry System.
    5. Classify B2B (if GST/Company mentioned) vs B2C.
    6. Verify for errors (e.g., negative stock, mismatched amounts).
    
    Output JSON format strictly matching the schema.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      voucherData: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "YYYY-MM-DD format" },
          type: { type: Type.STRING, enum: ["Sales", "Purchase", "Payment", "Receipt", "Contra", "Journal"] },
          branch: { type: Type.STRING, description: "Infer branch or default to Head Office" },
          narration: { type: Type.STRING },
          entries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ledgerName: { type: Type.STRING, description: "Must match one of the available ledgers provided in context exactly." },
                amount: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ["Dr", "Cr"] }
              },
              required: ["ledgerName", "amount", "type"]
            }
          }
        },
        required: ["date", "type", "branch", "narration", "entries"]
      },
      classification: { type: Type.STRING, enum: ["B2B", "B2C", "Internal"] },
      classificationReason: { type: Type.STRING },
      verification: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ["Verified", "Error", "Warning"] },
          message: { type: Type.STRING }
        },
        required: ["status", "message"]
      },
      explanation: { type: Type.STRING, description: "Explain the Debit/Credit logic clearly." },
      summary: { type: Type.STRING, description: "A brief summary for the business owner." },
      stockUpdate: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING, description: "Must match exact stock name from context if applicable." },
          quantityChange: { type: Type.NUMBER, description: "Negative for sales, Positive for purchase." }
        },
        nullable: true
      }
    },
    required: ["voucherData", "classification", "classificationReason", "verification", "explanation", "summary"]
  };

  try {
    const parts: any[] = [];
    
    if (imagePart) {
      parts.push(imagePart);
    }

    if (inputText) {
      parts.push({ text: inputText });
    } else if (imagePart) {
      parts.push({ text: "Analyze this image receipt/invoice and extract accounting details." });
    }

    // Use gemini-3-pro-preview if image is present for better multimodal understanding
    const model = imagePart ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to process transaction with AI.");
  }
};
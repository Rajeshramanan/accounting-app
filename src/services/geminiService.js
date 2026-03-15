import { GoogleGenAI, Type } from "@google/genai";
// FIX: Use Vite's import.meta.env for browser compatibility.
// process.env will cause the app to crash.
const apiKey = import.meta.env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });
export const analyzeTransaction = async (inputText, ledgers, stock, imagePart, recentVouchers = []) => {
    const ledgerNames = ledgers.map(l => l.name).join(", ");
    const stockItems = stock.map(s => `${s.name} (${s.unit}) @ ${s.rate}`).join(", ");
    
    // Format recent vouchers for context. Note: saved vouchers have a flattened structure compared to Gemini output.
    const recentVouchersContext = recentVouchers.length > 0 
        ? recentVouchers.map(v => {
            const date = v?.date || v?.voucherData?.date || 'Unknown Date';
            const type = v?.type || v?.voucherData?.type || 'Unknown Type';
            const entries = v?.entries || v?.voucherData?.entries || [];
            const narration = v?.narration || v?.voucherData?.narration || 'No Narration';
            return `- [${date} / ${type}] ${entries.map(e => `${e.type} ${e.ledgerName} ${e.amount}`).join(", ")} | Narration: ${narration}`;
        }).join("\n    ")
        : "None";

    const systemPrompt = `
    You are an advanced AI Accounting Engine for 'RS Traders & Co'.
    Your role is to simulate a Chartered Accountant and Tally Expert.
    
    Current Business Context:
    - Branches: Head Office – Coimbatore, Branch Office – Tiruppur
    - Available Ledgers: ${ledgerNames}
    - Available Stock: ${stockItems}
    - Recently Saved Transactions (for duplicate detection):
    ${recentVouchersContext}
    
    Task:
    Analyze the user provided transaction text (receipt/invoice/note) and/or image.
    1. Extract Date, Amount, Product, Quantity, Tax.
    2. Identify the Voucher Type (Sales, Purchase, Payment, Receipt, Contra, Journal).
    3. Match with existing ledgers strictly. If a specific customer/vendor name is used, map it to 'Accounts Receivable' or 'Accounts Payable' if a specific ledger doesn't exist, but mention the specific name in the narration.
    4. Determine Debit/Credit logic based on Double Entry System.
    5. Classify B2B (if GST/Company mentioned) vs B2C.
    6. Verify for errors (e.g., negative stock, mismatched amounts).
    7. CHECK FOR POTENTIAL DUPLICATES: Compare the extracted transaction against the 'Recently Saved Transactions'. If it appears to be a duplicate (same date, similar amount, same ledgers, same narration intent), set 'verification.status' to 'Warning' and 'verification.message' to 'Potential Duplicate Entry detected based on recent vouchers.'
    
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
        const parts = [];
        if (imagePart) {
            parts.push(imagePart);
        }
        if (inputText) {
            parts.push({ text: inputText });
        }
        else if (imagePart) {
            parts.push({ text: "Analyze this image receipt/invoice and extract accounting details." });
        }
        // Use gemini-2.5-flash for both text and image as it supports multimodal and has a better free tier quota.
        const model = 'gemini-2.5-flash';
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
        if (!text)
            throw new Error("No response from AI");
        return JSON.parse(text);
    }
    catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error(`Failed to process transaction with AI: ${error.message || error}`);
    }
};

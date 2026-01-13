export type VoucherType = 'Sales' | 'Purchase' | 'Payment' | 'Receipt' | 'Contra' | 'Journal';

export interface Ledger {
  id: string;
  name: string;
  group: 'Capital' | 'Current Assets' | 'Current Liabilities' | 'Income' | 'Expenses' | 'Tax';
  balance: number; // Positive = Dr, Negative = Cr (simplified for display, usually tracked separately)
  balanceType: 'Dr' | 'Cr';
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  rate: number;
  quantity: number;
}

export interface VoucherEntry {
  ledgerId: string;
  ledgerName: string; // Denormalized for display
  amount: number;
  type: 'Dr' | 'Cr';
}

export interface Voucher {
  id: string;
  number: string;
  date: string;
  type: VoucherType;
  branch: string;
  entries: VoucherEntry[];
  narration: string;
  classification: 'B2B' | 'B2C' | 'Internal';
  classificationReason: string;
  aiVerificationStatus: 'Verified' | 'Error' | 'Warning';
  aiVerificationMessage: string;
  aiExplanation: string;
  summaryForOwner: string;
}

export interface BusinessProfile {
  name: string;
  type: string;
  method: string;
  financialYear: string;
  currency: string;
  branches: string[];
}

export interface AIAnalysisResponse {
  voucherData: {
    date: string;
    type: VoucherType;
    branch: string;
    narration: string;
    entries: {
      ledgerName: string;
      amount: number;
      type: 'Dr' | 'Cr';
    }[];
  };
  classification: 'B2B' | 'B2C' | 'Internal';
  classificationReason: string;
  verification: {
    status: 'Verified' | 'Error' | 'Warning';
    message: string;
  };
  explanation: string; // Debit/Credit explanation
  summary: string;
  stockUpdate?: {
    itemName: string;
    quantityChange: number; // Negative for sales, Positive for purchase
  };
}
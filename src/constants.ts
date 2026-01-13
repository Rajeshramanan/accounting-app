import { BusinessProfile, Ledger, StockItem } from './types';

export const BUSINESS_PROFILE: BusinessProfile = {
  name: "RS Traders & Co",
  type: "Wholesale & Retail Trading",
  method: "Double Entry System",
  financialYear: "2024–2025",
  currency: "INR",
  branches: ["Head Office – Coimbatore", "Branch Office – Tiruppur"]
};

export const INITIAL_LEDGERS: Ledger[] = [
  { id: 'l1', name: 'Owner Capital', group: 'Capital', balance: 500000, balanceType: 'Cr' },
  { id: 'l2', name: 'Cash', group: 'Current Assets', balance: 50000, balanceType: 'Dr' },
  { id: 'l3', name: 'Bank Account', group: 'Current Assets', balance: 120000, balanceType: 'Dr' },
  { id: 'l4', name: 'Accounts Receivable', group: 'Current Assets', balance: 0, balanceType: 'Dr' },
  { id: 'l5', name: 'Accounts Payable', group: 'Current Liabilities', balance: 0, balanceType: 'Cr' },
  { id: 'l6', name: 'Sales Account', group: 'Income', balance: 0, balanceType: 'Cr' },
  { id: 'l7', name: 'Purchase Account', group: 'Expenses', balance: 0, balanceType: 'Dr' },
  { id: 'l8', name: 'Rent Expense', group: 'Expenses', balance: 0, balanceType: 'Dr' },
  { id: 'l9', name: 'Electricity Expense', group: 'Expenses', balance: 0, balanceType: 'Dr' },
  { id: 'l10', name: 'Transport Expense', group: 'Expenses', balance: 0, balanceType: 'Dr' },
  { id: 'l11', name: 'GST Output', group: 'Tax', balance: 0, balanceType: 'Cr' },
  { id: 'l12', name: 'GST Input', group: 'Tax', balance: 0, balanceType: 'Dr' },
];

export const INITIAL_STOCK: StockItem[] = [
  { id: 's1', name: 'Rice Bag – 25 KG', unit: 'Bag', rate: 1200, quantity: 100 },
  { id: 's2', name: 'Wheat Flour – 10 KG', unit: 'Packet', rate: 450, quantity: 50 },
  { id: 's3', name: 'Cooking Oil – 1 Litre', unit: 'Bottle', rate: 180, quantity: 200 },
];

export const SAMPLE_PROMPTS = [
  "Sold 5 Rice Bags to Krishna Stores (GST: 33ABCDE1234F1Z5) for cash. Received 6000.",
  "Purchased 50 packets of Wheat Flour from TN Agro Ltd on credit for 22500 plus 5% tax.",
  "Paid Office Rent of 15000 by Cheque for Coimbatore Head Office.",
  "Sold 2 bottles of Oil to a walking customer for 360 cash."
];
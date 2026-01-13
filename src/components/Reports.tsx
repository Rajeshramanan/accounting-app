import React from 'react';
import type { Ledger, StockItem, Voucher } from '../types';

interface ReportsProps {
  view: string;
  vouchers: Voucher[];
  ledgers: Ledger[];
  stock: StockItem[];
}

const TableHeader = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-2 py-1 border border-gray-500 dark:border-accounting-dark-border bg-[#e0e0e0] dark:bg-accounting-dark-header text-black dark:text-accounting-dark-text font-bold text-xs text-left whitespace-nowrap">
    {children}
  </th>
);

const TableCell = ({ children, className, align = 'left' }: { children?: React.ReactNode, className?: string, align?: 'left' | 'right' }) => (
  <td className={`px-2 py-0.5 border border-gray-400 dark:border-accounting-dark-border text-xs text-black dark:text-accounting-dark-text whitespace-nowrap ${align === 'right' ? 'text-right font-mono' : ''} ${className || ''}`}>
    {children}
  </td>
);

const Reports: React.FC<ReportsProps> = ({ view, vouchers, ledgers, stock }) => {
  
  const DayBook = () => (
    <div className="p-2 h-full flex flex-col">
        <div className="mb-2 text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-black dark:border-accounting-dark-border pb-1 shrink-0">
            Day Book Register [1-Apr-2024 to 31-Mar-2025]
        </div>
        <div className="flex-1 overflow-auto border border-gray-500 dark:border-accounting-dark-border bg-white dark:bg-accounting-dark-panel">
            <div className="min-w-max">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr>
                            <TableHeader>Date</TableHeader>
                            <TableHeader>Particulars</TableHeader>
                            <TableHeader>Vch Type</TableHeader>
                            <TableHeader>Vch No</TableHeader>
                            <TableHeader>Debit (₹)</TableHeader>
                            <TableHeader>Credit (₹)</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.length === 0 ? (
                            <tr><TableCell className="text-center italic text-gray-500 dark:text-accounting-dark-muted py-4" align="left">-- No Records Found --</TableCell></tr>
                        ) : (
                            vouchers.map((v, idx) => {
                                const drEntry = v.entries.find(e => e.type === 'Dr');
                                return (
                                    <tr key={v.id} className={idx % 2 === 0 ? 'bg-white dark:bg-accounting-dark-panel' : 'bg-[#f9f9f9] dark:bg-[#252525]'}>
                                        <TableCell>{v.date}</TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{drEntry?.ledgerName}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-accounting-dark-muted truncate max-w-[200px]">{v.narration}</div>
                                        </TableCell>
                                        <TableCell>{v.type}</TableCell>
                                        <TableCell>{v.number}</TableCell>
                                        <TableCell align="right">{drEntry?.amount.toFixed(2)}</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const StockSummary = () => (
    <div className="p-2 h-full flex flex-col">
        <div className="mb-2 text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-black dark:border-accounting-dark-border pb-1 shrink-0">Stock Summary</div>
        <div className="flex-1 overflow-auto border border-gray-500 dark:border-accounting-dark-border bg-white dark:bg-accounting-dark-panel">
            <div className="min-w-max">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <TableHeader>Item Name</TableHeader>
                            <TableHeader>Unit</TableHeader>
                            <TableHeader>Rate</TableHeader>
                            <TableHeader>Quantity</TableHeader>
                            <TableHeader>Value</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {stock.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white dark:bg-accounting-dark-panel' : 'bg-[#f9f9f9] dark:bg-[#252525]'}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{(item.rate * item.quantity).toFixed(2)}</TableCell>
                            </tr>
                        ))}
                        <tr className="bg-[#e0e0e0] dark:bg-accounting-dark-header font-bold">
                            <TableCell>Grand Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">
                                {stock.reduce((acc, item) => acc + (item.rate * item.quantity), 0).toFixed(2)}
                            </TableCell>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const LedgerSummary = () => (
    <div className="p-2 h-full overflow-auto">
        <div className="mb-2 text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-black dark:border-accounting-dark-border pb-1 shrink-0">Chart of Accounts</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['Capital', 'Current Assets', 'Current Liabilities', 'Income', 'Expenses', 'Tax'].map(group => (
                 <div key={group} className="border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-accounting-dark-panel">
                     <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 font-bold text-xs border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text uppercase">{group}</div>
                     <div>
                        {ledgers.filter(l => l.group === group).map((l, idx) => (
                             <div key={l.id} className={`flex justify-between text-xs px-2 py-1 border-b border-gray-300 dark:border-accounting-dark-border last:border-0 ${idx % 2 !== 0 ? 'bg-[#f9f9f9] dark:bg-[#252525]' : 'dark:bg-accounting-dark-panel'}`}>
                                <span className="text-black dark:text-accounting-dark-text">{l.name}</span>
                                <span className={`font-mono ${l.balance < 0 ? 'text-red-700 dark:text-red-400' : 'text-black dark:text-accounting-dark-text'}`}>
                                    {Math.abs(l.balance).toFixed(2)} {l.balanceType}
                                </span>
                             </div>
                        ))}
                     </div>
                 </div>
             ))}
        </div>
    </div>
  );

  const FinancialReports = () => {
      const purchaseBal = ledgers.find(l => l.name === 'Purchase Account')?.balance || 0;
      const salesBal = Math.abs(ledgers.find(l => l.name === 'Sales Account')?.balance || 0);
      const expenses = ledgers.filter(l => l.group === 'Expenses' && l.name !== 'Purchase Account');
      const closingStock = stock.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
      
      const totalCredits = salesBal + closingStock;
      const totalDebits = purchaseBal + expenses.reduce((acc, l) => acc + l.balance, 0);
      const netDiff = totalCredits - totalDebits;

      return (
      <div className="p-2 h-full flex flex-col overflow-auto">
          <div className="mb-2 text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-black dark:border-accounting-dark-border pb-1 shrink-0">
               Profit & Loss A/c [Year Ending 31-Mar-2025]
          </div>
          
          <div className="flex flex-col md:flex-row text-xs border border-gray-500 dark:border-accounting-dark-border bg-white dark:bg-accounting-dark-panel min-w-max md:min-w-0">
              {/* Left Side: Dr */}
              <div className="flex-1 md:border-r border-gray-500 dark:border-accounting-dark-border border-b md:border-b-0">
                  <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 font-bold text-center border-b border-gray-500 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">Particulars (Dr)</div>
                  <div>
                      <div className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border">
                        <span className="dark:text-accounting-dark-text">Opening Stock</span>
                        <span className="font-mono dark:text-accounting-dark-text">0.00</span> 
                      </div>
                      <div className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border">
                        <span className="dark:text-accounting-dark-text">Purchase Accounts</span>
                        <span className="font-mono dark:text-accounting-dark-text">{purchaseBal.toFixed(2)}</span>
                      </div>
                      {expenses.map(l => (
                            <div key={l.id} className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border">
                            <span className="pl-4 italic dark:text-accounting-dark-text">{l.name}</span>
                            <span className="font-mono dark:text-accounting-dark-text">{l.balance.toFixed(2)}</span>
                        </div>
                        ))}
                      
                      {netDiff > 0 && (
                          <div className="flex justify-between px-2 py-1 font-bold mt-4 bg-[#f0f0f0] dark:bg-[#252525] border-t border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">
                              <span>Net Profit</span>
                              <span className="font-mono">{netDiff.toFixed(2)}</span>
                          </div>
                      )}
                  </div>
              </div>

              {/* Right Side: Cr */}
              <div className="flex-1">
                  <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 font-bold text-center border-b border-gray-500 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">Particulars (Cr)</div>
                  <div>
                      <div className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border">
                        <span className="dark:text-accounting-dark-text">Sales Accounts</span>
                        <span className="font-mono dark:text-accounting-dark-text">{salesBal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border">
                        <span className="dark:text-accounting-dark-text">Closing Stock</span>
                        <span className="font-mono dark:text-accounting-dark-text">{closingStock.toFixed(2)}</span>
                      </div>

                       {netDiff < 0 && (
                          <div className="flex justify-between px-2 py-1 font-bold mt-4 bg-[#f0f0f0] dark:bg-[#252525] border-t border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">
                              <span>Net Loss</span>
                              <span className="font-mono">{Math.abs(netDiff).toFixed(2)}</span>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  )};

  if (view === 'daybook') return <DayBook />;
  if (view === 'inventory') return <StockSummary />;
  if (view === 'reports') return <FinancialReports />;
  return null;
};

export default Reports;
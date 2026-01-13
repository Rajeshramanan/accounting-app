import React from 'react';
import { Ledger } from '../types';

interface AccountsInfoProps {
  ledgers: Ledger[];
  onUpdateLedger: (updatedLedger: Ledger) => void;
}

const AccountsInfo: React.FC<AccountsInfoProps> = ({ ledgers, onUpdateLedger }) => {

  const handleAmountChange = (ledger: Ledger, amountStr: string) => {
    const amount = parseFloat(amountStr) || 0;
    onUpdateLedger({ ...ledger, balance: amount });
  };

  const handleTypeChange = (ledger: Ledger, type: 'Dr' | 'Cr') => {
    onUpdateLedger({ ...ledger, balanceType: type });
  };

  const groups = ['Capital', 'Current Assets', 'Current Liabilities', 'Income', 'Expenses', 'Tax'];

  return (
    <div className="p-2 h-full flex flex-col overflow-hidden bg-[#e8e8e8] dark:bg-accounting-dark-bg transition-colors">
      <div className="bg-[#f0f0f0] dark:bg-accounting-dark-panel border border-gray-500 dark:border-accounting-dark-border p-2 mb-2 shrink-0">
          <div className="text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-gray-400 dark:border-accounting-dark-border pb-1 mb-1">
              Ledger Configuration & Opening Balances
          </div>
          <div className="text-[11px] text-gray-600 dark:text-accounting-dark-muted">
              Update the opening balances for each ledger account manually. Ensure Debit/Credit correctness.
          </div>
      </div>

      <div className="flex-1 bg-white dark:bg-accounting-dark-panel border border-gray-500 dark:border-accounting-dark-border flex flex-col min-h-0 overflow-auto">
          <div className="min-w-[500px] md:min-w-0">
            <table className="w-full text-xs border-collapse border border-gray-300 dark:border-accounting-dark-border">
                <thead className="bg-[#e0e0e0] dark:bg-accounting-dark-header sticky top-0 z-10">
                    <tr>
                        <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-left w-1/3 text-black dark:text-accounting-dark-text">Ledger Name</th>
                        <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-left w-1/4 text-black dark:text-accounting-dark-text">Group</th>
                        <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-right w-1/4 text-black dark:text-accounting-dark-text">Opening Balance</th>
                        <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-center w-1/6 text-black dark:text-accounting-dark-text">Dr/Cr</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => {
                        const groupLedgers = ledgers.filter(l => l.group === group);
                        if (groupLedgers.length === 0) return null;
                        return (
                            <React.Fragment key={group}>
                                <tr className="bg-gray-100 dark:bg-[#252525]">
                                    <td colSpan={4} className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 font-bold text-gray-700 dark:text-accounting-dark-muted uppercase">{group}</td>
                                </tr>
                                {groupLedgers.map(ledger => (
                                    <tr key={ledger.id} className="hover:bg-yellow-50 dark:hover:bg-[#333]">
                                        <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 font-medium text-black dark:text-accounting-dark-text">{ledger.name}</td>
                                        <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-gray-500 dark:text-accounting-dark-muted">{ledger.group}</td>
                                        <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-right p-0">
                                            <input 
                                                type="number"
                                                className="w-full h-full text-right px-1 py-1 focus:bg-yellow-100 dark:focus:bg-[#444] outline-none bg-transparent text-black dark:text-accounting-dark-text"
                                                value={ledger.balance}
                                                onChange={(e) => handleAmountChange(ledger, e.target.value)}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </td>
                                        <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-center p-0">
                                            <select 
                                                className="w-full h-full text-center bg-transparent outline-none cursor-pointer text-black dark:text-accounting-dark-text dark:bg-accounting-dark-panel"
                                                value={ledger.balanceType}
                                                onChange={(e) => handleTypeChange(ledger, e.target.value as 'Dr' | 'Cr')}
                                            >
                                                <option value="Dr">Dr</option>
                                                <option value="Cr">Cr</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default AccountsInfo;
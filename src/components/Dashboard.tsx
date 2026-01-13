import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ledger, StockItem, Voucher } from '../types';

interface DashboardProps {
  ledgers: Ledger[];
  stock: StockItem[];
  vouchers: Voucher[];
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ ledgers, stock, vouchers, isDarkMode = false }) => {
  const cashBalance = ledgers.find(l => l.name === 'Cash')?.balance || 0;
  const bankBalance = ledgers.find(l => l.name === 'Bank Account')?.balance || 0;
  const sales = Math.abs(ledgers.find(l => l.name === 'Sales Account')?.balance || 0);
  const purchases = ledgers.find(l => l.name === 'Purchase Account')?.balance || 0;

  const chartData = [
    { name: '01-Apr', Sales: 4000, Purchase: 2400 },
    { name: '02-Apr', Sales: 3000, Purchase: 1398 },
    { name: '03-Apr', Sales: 2000, Purchase: 9800 },
    { name: '04-Apr', Sales: 2780, Purchase: 3908 },
    { name: '05-Apr', Sales: 1890, Purchase: 4800 },
    { name: '06-Apr', Sales: 2390, Purchase: 3800 },
    { name: 'Curr', Sales: sales > 0 ? sales : 3490, Purchase: purchases > 0 ? purchases : 4300 },
  ];

  // Colors for dark/light mode
  const chartAxisColor = isDarkMode ? '#B0B0B0' : '#000000';
  const chartGridColor = isDarkMode ? '#333333' : '#cccccc';
  const barSalesColor = isDarkMode ? '#4CAF50' : '#2d3748';
  const barPurchaseColor = isDarkMode ? '#8A8A8A' : '#a0aec0';
  const tooltipBg = isDarkMode ? '#1E1E1E' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#333333' : '#000000';

  return (
    <div className="p-2 h-full flex flex-col space-y-2 bg-[#f4f4f4] dark:bg-accounting-dark-bg overflow-auto transition-colors">
        
        {/* Key Figures Table */}
        <div className="bg-white dark:bg-accounting-dark-panel border border-gray-400 dark:border-accounting-dark-border shrink-0">
            <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">
                KEY PERFORMANCE INDICATORS
            </div>
            {/* Stack on mobile, grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-400 dark:divide-accounting-dark-border text-xs">
                <div className="p-2 flex justify-between md:block">
                    <div className="text-gray-600 dark:text-accounting-dark-muted mb-1">Cash in Hand</div>
                    <div className="font-mono font-bold text-black dark:text-accounting-dark-text">₹ {cashBalance.toFixed(2)}</div>
                </div>
                <div className="p-2 flex justify-between md:block">
                    <div className="text-gray-600 dark:text-accounting-dark-muted mb-1">Bank Account</div>
                    <div className="font-mono font-bold text-black dark:text-accounting-dark-text">₹ {bankBalance.toFixed(2)}</div>
                </div>
                <div className="p-2 flex justify-between md:block">
                    <div className="text-gray-600 dark:text-accounting-dark-muted mb-1">Total Sales (Cr)</div>
                    <div className="font-mono font-bold text-green-700 dark:text-accounting-dark-accent">₹ {sales.toFixed(2)}</div>
                </div>
                <div className="p-2 flex justify-between md:block">
                    <div className="text-gray-600 dark:text-accounting-dark-muted mb-1">Total Purchase (Dr)</div>
                    <div className="font-mono font-bold text-red-700 dark:text-red-400">₹ {purchases.toFixed(2)}</div>
                </div>
            </div>
        </div>

        {/* Stack chart and stock on mobile, side-by-side on desktop */}
        <div className="flex-1 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 min-h-[400px] md:min-h-0">
            {/* Chart Area */}
            <div className="flex-1 bg-white dark:bg-accounting-dark-panel border border-gray-400 dark:border-accounting-dark-border flex flex-col min-h-[200px]">
                <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text flex justify-between shrink-0">
                    <span>TURNOVER ANALYSIS</span>
                    <span>[Graphical View]</span>
                </div>
                <div className="flex-1 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={30}>
                        <CartesianGrid strokeDasharray="1 1" vertical={false} stroke={chartGridColor} />
                        <XAxis dataKey="name" stroke={chartAxisColor} fontSize={10} tickLine={true} axisLine={true} />
                        <YAxis stroke={chartAxisColor} fontSize={10} tickLine={true} axisLine={true} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '0px', border: `1px solid ${tooltipBorder}`, fontSize: '11px', padding: '4px', backgroundColor: tooltipBg }}
                            itemStyle={{ padding: 0, color: isDarkMode ? '#E0E0E0' : '#000' }}
                        />
                        <Bar dataKey="Sales" fill={barSalesColor} name="Sales" />
                        <Bar dataKey="Purchase" fill={barPurchaseColor} name="Purchase" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stock Table */}
            <div className="w-full md:w-1/3 bg-white dark:bg-accounting-dark-panel border border-gray-400 dark:border-accounting-dark-border flex flex-col min-h-[200px]">
                <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text shrink-0">
                    CRITICAL STOCK LEVELS
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-[#252525] sticky top-0">
                            <tr>
                                <th className="border-b border-gray-300 dark:border-accounting-dark-border px-2 py-1 font-semibold text-black dark:text-accounting-dark-text">Item</th>
                                <th className="border-b border-gray-300 dark:border-accounting-dark-border px-2 py-1 font-semibold text-black dark:text-accounting-dark-text text-right">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stock.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white dark:bg-accounting-dark-panel' : 'bg-gray-50 dark:bg-[#252525]'}>
                                    <td className="px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text truncate max-w-[200px]" title={item.name}>{item.name}</td>
                                    <td className={`px-2 py-1 border-b border-gray-200 dark:border-accounting-dark-border text-right font-mono ${item.quantity < 50 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-black dark:text-accounting-dark-text'}`}>
                                        {item.quantity} {item.unit}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
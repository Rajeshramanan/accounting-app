import React, { useState, useRef } from 'react';
import { analyzeTransaction } from '../services/geminiService';
import type { AIAnalysisResponse, Ledger, StockItem } from '../types';
import { SAMPLE_PROMPTS } from '../constants';

interface AIEntryProps {
  ledgers: Ledger[];
  stock: StockItem[];
  onSaveVoucher: (analysis: AIAnalysisResponse) => void;
}

const AIEntry: React.FC<AIEntryProps> = ({ ledgers, stock, onSaveVoucher }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
            setSelectedImage({
                mimeType: matches[1],
                data: matches[2]
            });
            setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim() && !selectedImage) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const imagePart = selectedImage ? { inlineData: selectedImage } : undefined;
      const result = await analyzeTransaction(input, ledgers, stock, imagePart);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (analysis) {
      onSaveVoucher(analysis);
      setAnalysis(null);
      setInput('');
      clearImage();
    }
  };

  return (
    <div className="p-2 h-full flex flex-col overflow-hidden bg-[#e8e8e8] dark:bg-accounting-dark-bg transition-colors">
      
      {/* Input Section */}
      <div className="bg-[#f0f0f0] dark:bg-accounting-dark-panel p-2 border border-gray-500 dark:border-accounting-dark-border mb-2 shrink-0">
        <div className="flex items-center justify-between mb-1">
             <label className="text-xs font-bold text-black dark:text-accounting-dark-text uppercase">Transaction Narrative / Upload</label>
             <div className="space-x-2">
                 <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                 />
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-2 md:py-0.5 bg-[#e0e0e0] dark:bg-[#333] border border-gray-600 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text text-xs hover:bg-[#d0d0d0] dark:hover:bg-[#444] rounded md:rounded-none touch-manipulation"
                 >
                    {selectedImage ? 'Image Attached [x]' : 'Attach Doc...'}
                 </button>
                 {selectedImage && <button onClick={clearImage} className="text-xs underline text-red-600 dark:text-red-400 p-2 md:p-0">Clear</button>}
             </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 h-auto md:h-20">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-1 text-xs border border-gray-600 dark:border-accounting-dark-border resize-none font-mono focus:bg-white dark:focus:bg-[#121212] bg-white dark:bg-[#1E1E1E] text-black dark:text-accounting-dark-text h-20 md:h-full"
                placeholder="Enter details..."
            />
            <div className="w-full md:w-32 flex flex-row md:flex-col gap-1">
                <button
                    onClick={handleAnalyze}
                    disabled={loading || (!input.trim() && !selectedImage)}
                    className="flex-1 bg-[#2d3748] dark:bg-[#181818] text-white text-xs font-bold border border-black dark:border-accounting-dark-border hover:bg-black dark:hover:bg-[#000] disabled:bg-gray-400 dark:disabled:bg-gray-700 py-3 md:py-0"
                >
                    {loading ? 'BUSY...' : 'PROCESS'}
                </button>
            </div>
        </div>
        
        {/* Quick Samples */}
        <div className="mt-2 md:mt-1 flex gap-2 md:gap-1 flex-wrap">
            {SAMPLE_PROMPTS.slice(0, 3).map((prompt, idx) => (
            <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="text-[10px] bg-white dark:bg-[#252525] border border-gray-300 dark:border-accounting-dark-border px-2 py-1 md:border-0 md:bg-transparent md:p-0 md:underline text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200"
            >
                [Sample {idx + 1}]
            </button>
        ))}
        </div>
        
        {error && <div className="text-red-600 dark:text-red-400 text-xs mt-1 font-bold">Error: {error}</div>}
      </div>

      {/* Voucher View Section - Accounting Grid */}
      {analysis && (
        <div className="flex-1 bg-white dark:bg-accounting-dark-panel border border-gray-500 dark:border-accounting-dark-border flex flex-col overflow-hidden">
          
          {/* Header Fields - Stack on Mobile */}
          <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header p-2 border-b border-gray-500 dark:border-accounting-dark-border grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs shrink-0">
             <div>
                <label className="block text-gray-600 dark:text-accounting-dark-muted font-bold mb-0.5">Voucher Type</label>
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-400 dark:border-accounting-dark-border px-1 py-0.5 font-bold uppercase text-black dark:text-accounting-dark-text">{analysis.voucherData.type}</div>
             </div>
             <div>
                <label className="block text-gray-600 dark:text-accounting-dark-muted font-bold mb-0.5">Date</label>
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-400 dark:border-accounting-dark-border px-1 py-0.5 font-mono text-black dark:text-accounting-dark-text">{analysis.voucherData.date}</div>
             </div>
             <div>
                <label className="block text-gray-600 dark:text-accounting-dark-muted font-bold mb-0.5">Branch</label>
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-400 dark:border-accounting-dark-border px-1 py-0.5 truncate text-black dark:text-accounting-dark-text">{analysis.voucherData.branch}</div>
             </div>
             <div>
                <label className="block text-gray-600 dark:text-accounting-dark-muted font-bold mb-0.5">Status</label>
                <div className={`px-1 py-0.5 font-bold text-center border ${analysis.verification.status === 'Verified' ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300'}`}>
                    {analysis.verification.status}
                </div>
             </div>
          </div>

          {/* Grid - Scrollable on Mobile */}
          <div className="flex-1 overflow-auto bg-white dark:bg-accounting-dark-panel relative">
                <div className="min-w-max md:min-w-0">
                    <table className="w-full text-xs border-collapse">
                        <thead className="bg-[#f0f0f0] dark:bg-[#252525] border-b border-gray-500 dark:border-accounting-dark-border sticky top-0">
                            <tr>
                                <th className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-left w-12 text-black dark:text-accounting-dark-text">D/C</th>
                                <th className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-left text-black dark:text-accounting-dark-text">Particulars</th>
                                <th className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-right w-24 md:w-32 text-black dark:text-accounting-dark-text">Debit</th>
                                <th className="px-2 py-1 text-right w-24 md:w-32 text-black dark:text-accounting-dark-text">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.voucherData.entries.map((entry, idx) => (
                                <tr key={idx} className="border-b border-gray-200 dark:border-accounting-dark-border">
                                    <td className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 font-bold text-gray-600 dark:text-accounting-dark-muted">
                                        {entry.type === 'Dr' ? 'Dr' : 'Cr'}
                                    </td>
                                    <td className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1">
                                        <span className="font-bold text-black dark:text-accounting-dark-text">{entry.ledgerName}</span>
                                    </td>
                                    <td className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-right font-mono text-black dark:text-accounting-dark-text">
                                        {entry.type === 'Dr' ? entry.amount.toFixed(2) : ''}
                                    </td>
                                    <td className="px-2 py-1 text-right font-mono text-black dark:text-accounting-dark-text">
                                        {entry.type === 'Cr' ? entry.amount.toFixed(2) : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#e0e0e0] dark:bg-accounting-dark-header font-bold border-t border-gray-500 dark:border-accounting-dark-border sticky bottom-0 text-black dark:text-accounting-dark-text">
                            <tr>
                                <td colSpan={2} className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-right">Totals:</td>
                                <td className="border-r border-gray-400 dark:border-accounting-dark-border px-2 py-1 text-right font-mono">
                                    {analysis.voucherData.entries.filter(e => e.type === 'Dr').reduce((s, e) => s + e.amount, 0).toFixed(2)}
                                </td>
                                <td className="px-2 py-1 text-right font-mono">
                                    {analysis.voucherData.entries.filter(e => e.type === 'Cr').reduce((s, e) => s + e.amount, 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
          </div>

          {/* Footer Info */}
          <div className="bg-[#f0f0f0] dark:bg-accounting-dark-header p-2 border-t border-gray-500 dark:border-accounting-dark-border text-xs shrink-0">
                <div className="mb-2">
                    <label className="font-bold text-black dark:text-accounting-dark-text mr-2">Narration:</label>
                    <span className="font-mono text-black dark:text-accounting-dark-text italic bg-white dark:bg-[#1E1E1E] border-b border-gray-400 dark:border-accounting-dark-border px-1 inline-block w-full md:w-auto md:min-w-[300px]">
                        {analysis.voucherData.narration}
                    </span>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-1 text-[11px] mb-2 text-black dark:text-accounting-dark-text">
                    <span className="font-bold">System Note:</span> {analysis.explanation} [{analysis.classification}]
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setAnalysis(null)}
                        className="px-4 py-2 md:py-1 border border-gray-500 dark:border-accounting-dark-border bg-[#e0e0e0] dark:bg-[#333] hover:bg-[#d0d0d0] dark:hover:bg-[#444] text-black dark:text-accounting-dark-text rounded md:rounded-none"
                    >
                        Quit (Esc)
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 md:py-1 bg-[#2d3748] dark:bg-[#181818] text-white font-bold border border-black dark:border-accounting-dark-border hover:bg-black dark:hover:bg-[#000] rounded md:rounded-none"
                    >
                        Accept (Enter)
                    </button>
                </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AIEntry;
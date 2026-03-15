import React, { useState, useRef } from 'react';
import { analyzeTransaction } from '../services/geminiService';
import { SAMPLE_PROMPTS } from '../constants';
const AIEntry = ({ ledgers, stock, onSaveVoucher }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
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
        if (!input.trim() && !selectedImage)
            return;
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const imagePart = selectedImage ? { inlineData: selectedImage } : undefined;
            // Fetch the last 5 vouchers to check for duplicates
            const recentVouchersStr = localStorage.getItem('accusim_vouchers');
            const recentVouchers = recentVouchersStr ? JSON.parse(recentVouchersStr).slice(0, 5) : [];
            
            const result = await analyzeTransaction(input, ledgers, stock, imagePart, recentVouchers);
            setAnalysis(result);
        }
        catch (err) {
            setError(err.message || "Processing failed.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = () => {
        if (analysis) {
            onSaveVoucher(analysis, selectedImage);
            setAnalysis(null);
            setInput('');
            clearImage();
        }
    };
    return (<div className="p-2 h-full flex flex-col overflow-hidden bg-[#e8e8e8] dark:bg-accounting-dark-bg transition-colors">
      
      {/* Input Section */}
      {!analysis && (
      <div className="bg-[#f0f0f0] dark:bg-accounting-dark-panel p-2 border border-gray-500 dark:border-accounting-dark-border mb-2 shrink-0">
        <div className="flex items-center justify-between mb-1">
             <label className="text-xs font-bold text-black dark:text-accounting-dark-text uppercase">Transaction Narrative / Upload</label>
             <div className="space-x-2">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                 <button onClick={() => fileInputRef.current?.click()} className="px-2 py-2 md:py-0.5 bg-[#e0e0e0] dark:bg-[#333] border border-gray-600 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text text-xs hover:bg-[#d0d0d0] dark:hover:bg-[#444] rounded md:rounded-none touch-manipulation">
                    {selectedImage ? 'Image Attached [x]' : 'Attach Doc...'}
                 </button>
                 {selectedImage && <button onClick={clearImage} className="text-xs underline text-red-600 dark:text-red-400 p-2 md:p-0">Clear</button>}
             </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 h-auto md:h-20">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-1 text-xs border border-gray-600 dark:border-accounting-dark-border resize-none font-mono focus:bg-white dark:focus:bg-[#121212] bg-white dark:bg-[#1E1E1E] text-black dark:text-accounting-dark-text h-20 md:h-full" placeholder="Enter details..."/>
            <div className="w-full md:w-32 flex flex-row md:flex-col gap-1">
                <button onClick={handleAnalyze} disabled={loading || (!input.trim() && !selectedImage)} className="flex-1 bg-[#2d3748] dark:bg-[#181818] text-white text-xs font-bold border border-black dark:border-accounting-dark-border hover:bg-black dark:hover:bg-[#000] disabled:bg-gray-400 dark:disabled:bg-gray-700 py-3 md:py-0">
                    {loading ? 'BUSY...' : 'PROCESS'}
                </button>
            </div>
        </div>
        
        {/* Quick Samples */}
        <div className="mt-2 md:mt-1 flex gap-2 md:gap-1 flex-wrap">
            {SAMPLE_PROMPTS.slice(0, 3).map((prompt, idx) => (<button key={idx} onClick={() => setInput(prompt)} className="text-[10px] bg-white dark:bg-[#252525] border border-gray-300 dark:border-accounting-dark-border px-2 py-1 md:border-0 md:bg-transparent md:p-0 md:underline text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">
                [Sample {idx + 1}]
            </button>))}
        </div>
        
        {error && <div className="text-red-600 dark:text-red-400 text-xs mt-1 font-bold">Error: {error}</div>}
      </div>
      )}

      {/* Classic Tally ERP Voucher View Section */}
      {analysis && (<div className="flex-1 bg-[#FFFFE6] dark:bg-[#1a1a14] flex flex-col overflow-hidden border-2 border-[#005a3c] dark:border-[#008a5c] shadow-lg text-black dark:text-[#E0E0E0] font-sans">
          
          {/* Tally Header Bar */}
          <div className="bg-[#005a3c] dark:bg-[#004a2c] text-white flex justify-between px-2 py-0.5 text-sm shrink-0 items-center">
              <span className="font-semibold italic">Accounting Voucher Creation</span>
              <span className="font-bold hidden md:inline">RS Traders & Co</span>
              <div className="flex space-x-2 text-xs items-center">
                  <span className="hidden md:inline">Ctrl + M</span>
                  <button onClick={() => setAnalysis(null)} className="opacity-80 hover:opacity-100 font-bold border border-white px-1">X</button>
              </div>
          </div>

          {/* Sub Header (Voucher Type & Date) */}
          <div className="flex justify-between items-start p-2 shrink-0 relative">
              <div className="flex items-center">
                  <div className={`text-white font-bold px-4 py-1 flex items-center justify-center min-w-[120px] shadow-sm ${
                      analysis.voucherData.type === 'Payment' ? 'bg-[#c23636]' :
                      analysis.voucherData.type === 'Receipt' ? 'bg-[#e5a93e] text-black' :
                      analysis.voucherData.type === 'Sales' ? 'bg-[#5ea85e]' :
                      analysis.voucherData.type === 'Purchase' ? 'bg-[#5e9ca8]' :
                      analysis.voucherData.type === 'Contra' ? 'bg-white text-black border border-gray-400' :
                      'bg-[#c28436]' // Journal
                  }`}>
                      {analysis.voucherData.type}
                  </div>
                  <span className="ml-2 font-bold text-sm">No. <span className="text-red-700 dark:text-red-400">New</span></span>
              </div>
              <div className="text-right leading-tight">
                  <div className="font-bold text-sm">{analysis.voucherData.date}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-400">{new Date(analysis.voucherData.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
              </div>
          </div>

          {/* AI Verification Badge */}
          <div className="px-2 pb-1 shrink-0 text-xs">
                 <div className={`px-2 py-1 font-bold border inline-block ${
                    analysis.verification.status === 'Verified' ? 'bg-green-100 border-green-500 text-green-800' 
                    : analysis.verification.status === 'Error' ? 'bg-red-100 border-red-500 text-red-800' 
                    : 'bg-yellow-100 border-yellow-500 text-yellow-800'
                 }`}>
                    {analysis.verification.status}: {analysis.verification.message}
                 </div>
          </div>

          {/* Grid - Particulars and Amount */}
          <div className="flex-1 overflow-auto flex flex-col relative mx-2">
                <table className="w-full text-sm border-t-2 border-b-2 border-black dark:border-gray-500 border-collapse">
                    <thead className="border-b-2 border-black dark:border-gray-500">
                        <tr>
                            <th className="px-2 py-1 text-left font-bold w-3/4">Particulars</th>
                            <th className="px-2 py-1 text-right font-bold w-1/4">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analysis.voucherData.entries.map((entry, idx) => (<tr key={idx}>
                                <td className="px-2 py-2 border-r border-[#e0e0e0] dark:border-[#333]">
                                    <div className="flex">
                                        <span className="font-bold italic mr-2 w-6 shrink-0 text-right">{entry.type === 'Dr' ? 'By' : 'To'}</span>
                                        <div>
                                            <div className="font-bold text-base">{entry.ledgerName}</div>
                                            {entry.details && <div className="text-[11px] text-[#00008b] dark:text-blue-300 italic whitespace-pre-wrap leading-tight mt-0.5">{entry.details}</div>}
                                            <div className="text-[11px] text-gray-600 dark:text-gray-400 italic">Cur Bal: 0.00 {entry.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 py-2 text-right font-bold align-top pt-3">
                                    {entry.amount.toFixed(2)} <span className="text-xs font-normal ml-1">{entry.type}</span>
                                </td>
                            </tr>))}
                    </tbody>
                </table>
          </div>

          {/* Footer Info (Narration & Totals) */}
          <div className="shrink-0 flex items-end justify-between px-2 pt-1 pb-2 min-h-[60px]">
                <div className="flex-1 mr-4 flex items-start text-sm">
                    <span className="mr-2 mt-1 whitespace-nowrap">Narration:</span>
                    <div className="flex-1 font-mono italic mt-1 pb-1 px-1 min-h-[24px]">
                        {analysis.voucherData.narration}
                    </div>
                </div>
                <div className="w-32 md:w-48 text-right bg-[#666666] dark:bg-[#444] text-white px-2 py-1 font-bold text-sm shrink-0 border border-gray-400 shadow-inner">
                    {analysis.voucherData.entries.filter(e => e.type === 'Dr').reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </div>
          </div>

          {/* Action Bar */}
          <div className="bg-[#2d3748] dark:bg-[#121212] p-2 flex justify-between items-center shrink-0 border-t border-black">
               <div className="text-[10px] text-gray-400 hidden md:block">
                   System Note: {analysis.explanation} [{analysis.classification}]
               </div>
               <div className="flex gap-2 w-full md:w-auto justify-end">
                   <button onClick={() => setAnalysis(null)} className="px-4 py-1.5 border border-gray-400 text-white hover:bg-[#4a5568] text-sm">
                       Quit (Esc)
                   </button>
                   <button onClick={handleSave} className="px-6 py-1.5 bg-[#fbbf24] text-black font-bold hover:bg-[#f59e0b] shadow-md text-sm">
                       Accept (Enter)
                   </button>
               </div>
          </div>
        </div>)}
    </div>);
};
export default AIEntry;

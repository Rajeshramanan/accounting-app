import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIEntry from './components/AIEntry';
import Reports from './components/Reports';
import Configuration from './components/Configuration';
import AccountsInfo from './components/AccountsInfo';
import { BUSINESS_PROFILE } from './constants';
import type { Ledger, StockItem, Voucher, AIAnalysisResponse, BusinessProfile } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Menu, Moon, Sun, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { dataService } from './services/dataService';
import { isCloudEnabled } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(BUSINESS_PROFILE);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const data = await dataService.getInitialData();
        setLedgers(data.ledgers);
        setStock(data.stock);
        setVouchers(data.vouchers);
        setBusinessProfile(data.profile);
        
        if (data.isCloudEmpty && isCloudEnabled) {
            // Seed initial data to cloud if it's a fresh connection
            await dataService.seedCloudIfEmpty(data.ledgers, data.stock, data.profile);
        }
        setLoading(false);
    };
    loadData();
  }, []);

  const handleSaveVoucher = async (analysis: AIAnalysisResponse) => {
    const newVoucher: Voucher = {
      id: uuidv4(),
      number: `V-${(vouchers.length + 1).toString().padStart(4, '0')}`,
      date: analysis.voucherData.date,
      type: analysis.voucherData.type,
      branch: analysis.voucherData.branch,
      narration: analysis.voucherData.narration,
      entries: analysis.voucherData.entries.map(e => ({...e, ledgerId: 'temp'})),
      classification: analysis.classification,
      classificationReason: analysis.classificationReason,
      aiVerificationStatus: analysis.verification.status,
      aiVerificationMessage: analysis.verification.message,
      aiExplanation: analysis.explanation,
      summaryForOwner: analysis.summary
    };

    // Calculate updates
    const updatedLedgers = [...ledgers];
    analysis.voucherData.entries.forEach(entry => {
      const ledgerIndex = updatedLedgers.findIndex(l => l.name === entry.ledgerName);
      if (ledgerIndex !== -1) {
        const ledger = { ...updatedLedgers[ledgerIndex] }; // Clone
        if (['Current Assets', 'Expenses', 'Tax', 'Purchase'].includes(ledger.group) || ledger.name.includes('Purchase')) {
           if (entry.type === 'Dr') ledger.balance += entry.amount;
           else ledger.balance -= entry.amount;
        } else {
           if (entry.type === 'Cr') ledger.balance += entry.amount;
           else ledger.balance -= entry.amount;
        }
        updatedLedgers[ledgerIndex] = ledger;
      }
    });

    const updatedStock = [...stock];
    if (analysis.stockUpdate) {
      const stockIndex = updatedStock.findIndex(s => s.name === analysis.stockUpdate?.itemName);
      if (stockIndex !== -1) {
        updatedStock[stockIndex] = { ...updatedStock[stockIndex] }; // Clone
        updatedStock[stockIndex].quantity += analysis.stockUpdate.quantityChange;
      }
    }

    // Optimistic Update
    setVouchers(prev => [newVoucher, ...prev]);
    setLedgers(updatedLedgers);
    setStock(updatedStock);

    // Persist
    await dataService.saveVoucher(newVoucher, updatedLedgers, updatedStock);

    setCurrentView('daybook');
  };

  const handleUpdateLedger = async (updatedLedger: Ledger) => {
    const newLedgers = await dataService.updateLedger(updatedLedger);
    setLedgers(newLedgers);
  };

  const handleUpdateProfile = async (newProfile: BusinessProfile) => {
      setBusinessProfile(newProfile);
      await dataService.saveProfile(newProfile);
  };

  const renderView = () => {
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <span>Loading Accounting Data...</span>
            </div>
        );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard ledgers={ledgers} stock={stock} vouchers={vouchers} isDarkMode={isDarkMode} />;
      case 'vouchers': return <AIEntry ledgers={ledgers} stock={stock} onSaveVoucher={handleSaveVoucher} />;
      case 'daybook': 
      case 'inventory': 
      case 'reports': 
        return <Reports view={currentView} vouchers={vouchers} ledgers={ledgers} stock={stock} />;
      case 'accounts': 
        return <AccountsInfo ledgers={ledgers} onUpdateLedger={handleUpdateLedger} />;
      case 'config':
        return <Configuration profile={businessProfile} onUpdate={handleUpdateProfile} />;
      default: return <div className="p-8 text-center text-slate-400">Configuration Module Not Loaded</div>;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
        case 'dashboard': return 'Gateway of Accounting';
        case 'vouchers': return 'Voucher Entry Screen';
        case 'daybook': return 'Day Book';
        case 'accounts': return 'Chart of Accounts';
        case 'inventory': return 'Stock Summary';
        case 'reports': return 'Financial Statements';
        case 'config': return 'System Configuration';
        default: return 'System';
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen flex flex-col`}>
      <div className="flex bg-[#d4d4d4] dark:bg-accounting-dark-bg h-screen font-sans overflow-hidden text-sm transition-colors duration-200">
        
        {/* Sidebar - Responsive */}
        <Sidebar 
          currentView={currentView} 
          onChangeView={(view) => {
              setCurrentView(view);
              setIsMobileMenuOpen(false);
          }} 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 flex flex-col h-full md:border-l border-white dark:border-accounting-dark-border w-full">
          {/* Title Bar */}
          <header className="h-10 md:h-8 bg-[#005a9e] dark:bg-[#1E1E1E] text-white flex items-center justify-between px-3 select-none shrink-0 transition-colors">
              <div className="flex items-center space-x-3">
                  {/* Mobile Hamburger */}
                  <button 
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="md:hidden text-white hover:bg-white/20 p-1 rounded-sm"
                  >
                      <Menu size={20} />
                  </button>

                  <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                      <span className="font-bold tracking-wide uppercase text-xs hidden md:inline">AccuSim Professional</span>
                      <span className="text-blue-200 dark:text-gray-500 hidden md:inline">|</span>
                      <span className="text-xs font-bold md:font-normal">{getHeaderTitle()}</span>
                  </div>
              </div>
              <div className="flex items-center space-x-4">
                 {/* Connection Status */}
                 <div className="flex items-center space-x-1" title={isCloudEnabled ? "Cloud Sync Active" : "Local Storage Only"}>
                    {isCloudEnabled ? <Cloud size={14} className="text-green-300" /> : <CloudOff size={14} className="text-red-300" />}
                 </div>

                <div className="text-[10px] md:text-xs font-mono hidden md:block">
                    {businessProfile.name} [{businessProfile.financialYear.split('–')[0].slice(-2)}-{businessProfile.financialYear.split('–')[1].slice(-2)}]
                </div>
                {/* Dark Mode Toggle */}
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-1 rounded hover:bg-white/10 text-white transition-colors"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
          </header>

          {/* Toolbar / Breadcrumbs - Hidden on small mobile to save space */}
          <div className="bg-[#f0f0f0] dark:bg-accounting-dark-panel border-b border-[#a0a0a0] dark:border-accounting-dark-border px-3 py-1 hidden md:flex items-center text-xs text-black dark:text-accounting-dark-text shrink-0 transition-colors">
              <span className="mr-2 text-gray-500 dark:text-accounting-dark-muted">Path:</span>
              <span className="font-semibold text-black dark:text-accounting-dark-text">Gateway &gt; {getHeaderTitle()}</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-0 md:p-2 overflow-y-auto bg-[#e8e8e8] dark:bg-accounting-dark-bg relative w-full transition-colors">
              <div className="bg-white dark:bg-accounting-dark-panel md:border border-[#888] dark:border-accounting-dark-border h-full overflow-auto shadow-none flex flex-col transition-colors">
                  {renderView()}
              </div>
          </div>

          {/* Mandatory Footer */}
          <footer className="bg-[#d4d4d4] dark:bg-accounting-dark-bg border-t border-gray-400 dark:border-accounting-dark-border p-1 text-center text-[10px] text-gray-600 dark:text-accounting-dark-muted shrink-0 transition-colors">
              This is an academic accounting software interface for educational purposes only.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
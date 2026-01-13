import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'accounts', label: 'Accounts Info' },
    { id: 'vouchers', label: 'Voucher Entry' },
    { id: 'inventory', label: 'Inventory Info' },
    { id: 'reports', label: 'Reports' },
    { id: 'config', label: 'Configuration' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#2d3748] dark:bg-[#181818] text-white flex flex-col font-sans border-r border-black dark:border-accounting-dark-border select-none transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:w-48
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-10 md:h-8 bg-[#1a202c] dark:bg-[#121212] flex items-center justify-between px-2 border-b border-gray-600 dark:border-accounting-dark-border shrink-0">
          <span className="font-bold text-xs uppercase tracking-wider text-yellow-400 dark:text-accounting-dark-accent">Menu</span>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full text-left px-3 py-3 md:py-1.5 text-sm md:text-xs font-medium transition-colors border-b border-gray-700 dark:border-[#222] ${
                  isActive
                    ? 'bg-[#fbbf24] text-black font-bold dark:bg-transparent dark:text-accounting-dark-accent dark:border-l-4 dark:border-l-accounting-dark-accent dark:pl-2'
                    : 'text-gray-300 hover:bg-[#4a5568] hover:text-white dark:text-[#E0E0E0] dark:hover:bg-[#252525]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-600 dark:border-accounting-dark-border bg-[#1a202c] dark:bg-[#121212] shrink-0">
          <div className="text-[10px] text-gray-400 font-mono">
            <div>Ver: 2.5.0</div>
            <div>Lic: Edu-User</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
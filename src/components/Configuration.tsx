import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface ConfigurationProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setFormData(prev => ({
        ...prev,
        branches: [...prev.branches, newBranch.trim()]
      }));
      setNewBranch('');
    }
  };

  const handleRemoveBranch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    alert("Configuration Saved Successfully");
  };

  return (
    <div className="p-2 h-full flex flex-col overflow-hidden bg-[#e8e8e8] dark:bg-accounting-dark-bg transition-colors">
      <div className="bg-[#f0f0f0] dark:bg-accounting-dark-panel border border-gray-500 dark:border-accounting-dark-border p-2 mb-2 shrink-0">
          <div className="text-xs font-bold text-black dark:text-accounting-dark-text uppercase border-b border-gray-400 dark:border-accounting-dark-border pb-1 mb-2">
              System Configuration
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="space-y-2">
                  <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-accounting-dark-muted mb-1">Business Name</label>
                      <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text focus:bg-yellow-50 dark:focus:bg-[#333]"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-accounting-dark-muted mb-1">Business Type</label>
                      <input 
                          type="text" 
                          value={formData.type}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="w-full p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text focus:bg-yellow-50 dark:focus:bg-[#333]"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-accounting-dark-muted mb-1">Accounting Method</label>
                      <select 
                          value={formData.method}
                          onChange={(e) => handleChange('method', e.target.value)}
                          className="w-full p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text focus:bg-yellow-50 dark:focus:bg-[#333]"
                      >
                          <option>Double Entry System</option>
                          <option>Single Entry System</option>
                      </select>
                  </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                   <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-accounting-dark-muted mb-1">Financial Year</label>
                      <input 
                          type="text" 
                          value={formData.financialYear}
                          onChange={(e) => handleChange('financialYear', e.target.value)}
                          className="w-full p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text focus:bg-yellow-50 dark:focus:bg-[#333]"
                      />
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-accounting-dark-muted mb-1">Base Currency</label>
                      <input 
                          type="text" 
                          value={formData.currency}
                          onChange={(e) => handleChange('currency', e.target.value)}
                          className="w-full p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text focus:bg-yellow-50 dark:focus:bg-[#333]"
                      />
                  </div>
              </div>
          </div>
      </div>

      <div className="flex-1 bg-white dark:bg-accounting-dark-panel border border-gray-500 dark:border-accounting-dark-border flex flex-col min-h-0">
          <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-2 py-1 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text">
              BRANCH MANAGEMENT
          </div>
          
          <div className="p-2 border-b border-gray-300 dark:border-accounting-dark-border bg-[#f9f9f9] dark:bg-[#252525] flex gap-2">
              <input 
                  type="text" 
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="Enter Branch Name & Location"
                  className="flex-1 p-1 text-xs border border-gray-600 dark:border-accounting-dark-border rounded-none bg-white dark:bg-[#2C2C2C] dark:text-accounting-dark-text"
              />
              <button 
                  onClick={handleAddBranch}
                  className="px-3 py-1 bg-[#2d3748] dark:bg-[#181818] text-white text-xs font-bold border border-black dark:border-accounting-dark-border hover:bg-black flex items-center"
              >
                  <Plus size={12} className="mr-1"/> Add
              </button>
          </div>

          <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-xs border-collapse border border-gray-300 dark:border-accounting-dark-border">
                  <thead className="bg-[#f0f0f0] dark:bg-[#252525]">
                      <tr>
                          <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-left w-12 text-black dark:text-accounting-dark-text">#</th>
                          <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-left text-black dark:text-accounting-dark-text">Branch Name</th>
                          <th className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-center w-20 text-black dark:text-accounting-dark-text">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {formData.branches.map((branch, index) => (
                          <tr key={index} className="hover:bg-yellow-50 dark:hover:bg-[#333]">
                              <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-center text-black dark:text-accounting-dark-text">{index + 1}</td>
                              <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-black dark:text-accounting-dark-text">{branch}</td>
                              <td className="border border-gray-300 dark:border-accounting-dark-border px-2 py-1 text-center">
                                  <button 
                                      onClick={() => handleRemoveBranch(index)}
                                      className="text-red-600 dark:text-red-400 hover:text-red-800"
                                  >
                                      <Trash2 size={12} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      <div className="mt-2 flex justify-end">
          <button 
              onClick={handleSave}
              className="px-6 py-2 bg-[#2d3748] dark:bg-[#181818] text-white text-sm font-bold border border-black dark:border-accounting-dark-border hover:bg-black shadow-sm flex items-center"
          >
              <Save size={14} className="mr-2"/> SAVE CONFIGURATION
          </button>
      </div>
    </div>
  );
};

export default Configuration;
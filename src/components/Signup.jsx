import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        type: '',
        method: 'Double Entry System',
        financialYear: '2024–2025',
        currency: 'INR',
        branches: []
    });

    const [branchInput, setBranchInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addBranch = () => {
        if (branchInput.trim() && !formData.branches.includes(branchInput.trim())) {
            setFormData({
                ...formData,
                branches: [...formData.branches, branchInput.trim()]
            });
            setBranchInput('');
        }
    };

    const removeBranch = (branch) => {
        setFormData({
            ...formData,
            branches: formData.branches.filter(b => b !== branch)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                onSignup(data);
                navigate('/');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred during signup');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#d4d4d4] dark:bg-accounting-dark-bg font-sans text-sm transition-colors duration-200">

            {/* Header matching App.jsx */}
            <header className="h-10 md:h-8 bg-[#005a9e] dark:bg-[#1E1E1E] text-white flex items-center px-3 select-none shrink-0 border-b border-[#004a8e] dark:border-accounting-dark-border transition-colors">
                <span className="font-bold tracking-wide uppercase text-xs">AccuSim Professional</span>
                <span className="text-blue-200 dark:text-gray-500 mx-2">|</span>
                <span className="text-xs">Company Initialization</span>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white dark:bg-accounting-dark-panel border border-gray-400 dark:border-accounting-dark-border shadow-sm w-full max-w-2xl flex flex-col transition-colors">

                    {/* Panel Header */}
                    <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-3 py-2 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text shrink-0 flex justify-between items-center">
                        <span>NEW COMPANY CREATION WIZARD</span>
                        <span className="text-[10px] font-normal text-gray-500">Step 1 of 1</span>
                    </div>

                    {/* Form Content */}
                    <div className="p-4 md:p-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-sm text-xs mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Company Name *</label>
                                        <input
                                            name="companyName"
                                            type="text"
                                            required
                                            className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Email Address *</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Password *</label>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Business Type</label>
                                        <input
                                            name="type"
                                            type="text"
                                            placeholder="e.g. Retail & Traders"
                                            className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                            value={formData.type}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2/3">
                                            <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Accounting Method</label>
                                            <select
                                                name="method"
                                                className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                                value={formData.method}
                                                onChange={handleChange}
                                            >
                                                <option>Double Entry System</option>
                                                <option>Single Entry System</option>
                                            </select>
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Currency</label>
                                            <input
                                                name="currency"
                                                type="text"
                                                className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                                value={formData.currency}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Financial Year</label>
                                        <input
                                            name="financialYear"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                            value={formData.financialYear}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Branches / Cost Centers</label>
                                        <div className="flex space-x-2 mb-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                                value={branchInput}
                                                onChange={(e) => setBranchInput(e.target.value)}
                                                placeholder="e.g. Head Office"
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBranch() } }}
                                            />
                                            <button
                                                type="button"
                                                onClick={addBranch}
                                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-accounting-dark-border text-black dark:text-white px-3 py-1 text-xs rounded-sm focus:outline-none transition-colors"
                                            >
                                                ADD
                                            </button>
                                        </div>

                                        {formData.branches.length > 0 ? (
                                            <div className="border border-gray-300 dark:border-accounting-dark-border rounded-sm max-h-24 overflow-y-auto">
                                                <ul className="divide-y divide-gray-200 dark:divide-accounting-dark-border">
                                                    {formData.branches.map(branch => (
                                                        <li key={branch} className="flex justify-between items-center px-2 py-1 text-xs bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text">
                                                            <span>{branch}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeBranch(branch)}
                                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                                                title="Remove Branch"
                                                            >
                                                                ✕
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500 italic p-1">No branches added.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-300 dark:border-accounting-dark-border mt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-[#005a9e] dark:bg-accounting-dark-accent hover:bg-[#004a8e] dark:hover:bg-green-700 text-white font-bold py-2 px-4 text-xs rounded-sm focus:outline-none transition-colors border border-transparent shadow-sm"
                                >
                                    INITIALIZE PROFILE & CREATE DATABASE
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer of the panel */}
                    <div className="bg-[#f0f0f0] dark:bg-[#252525] border-t border-gray-300 dark:border-accounting-dark-border p-2 text-center text-xs">
                        <span className="text-gray-600 dark:text-accounting-dark-muted">Profile Already Initialized? </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[#005a9e] dark:text-accounting-dark-accent hover:underline font-semibold focus:outline-none"
                        >
                            System Login Gateway
                        </button>
                    </div>

                </div>
            </div>

            {/* Mandatory Footer */}
            <footer className="bg-[#d4d4d4] dark:bg-accounting-dark-bg border-t border-gray-400 dark:border-accounting-dark-border p-1 text-center text-[10px] text-gray-600 dark:text-accounting-dark-muted shrink-0 transition-colors">
                This is an academic accounting software interface for educational purposes only.
            </footer>
        </div>
    );
};

export default Signup;

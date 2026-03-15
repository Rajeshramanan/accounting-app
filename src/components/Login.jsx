import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
                navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#d4d4d4] dark:bg-accounting-dark-bg font-sans text-sm transition-colors duration-200">

            {/* Header matching App.jsx */}
            <header className="h-10 md:h-8 bg-[#005a9e] dark:bg-[#1E1E1E] text-white flex items-center px-3 select-none shrink-0 border-b border-[#004a8e] dark:border-accounting-dark-border transition-colors">
                <span className="font-bold tracking-wide uppercase text-xs">AccuSim Professional</span>
                <span className="text-blue-200 dark:text-gray-500 mx-2">|</span>
                <span className="text-xs">Authentication Gateway</span>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-accounting-dark-panel border border-gray-400 dark:border-accounting-dark-border shadow-sm w-full max-w-sm flex flex-col transition-colors">

                    {/* Panel Header */}
                    <div className="bg-[#e0e0e0] dark:bg-accounting-dark-header px-3 py-2 text-xs font-bold border-b border-gray-400 dark:border-accounting-dark-border text-black dark:text-accounting-dark-text shrink-0 flex justify-between items-center">
                        <span>COMPANY LOGIN</span>
                        <span className="text-[10px] font-normal text-gray-500">v1.2.0</span>
                    </div>

                    {/* Form Content */}
                    <div className="p-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-sm text-xs mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Company Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-accounting-dark-text text-xs font-bold mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-accounting-dark-border bg-white dark:bg-[#252525] text-black dark:text-accounting-dark-text focus:outline-none focus:border-[#005a9e] dark:focus:border-accounting-dark-accent rounded-sm"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-[#005a9e] dark:bg-accounting-dark-accent hover:bg-[#004a8e] dark:hover:bg-green-700 text-white font-bold py-1.5 px-4 text-xs rounded-sm focus:outline-none transition-colors border border-transparent shadow-sm"
                                >
                                    ACCESS SYSTEM
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer of the panel */}
                    <div className="bg-[#f0f0f0] dark:bg-[#252525] border-t border-gray-300 dark:border-accounting-dark-border p-2 text-center text-[11px] flex justify-between items-center px-4">
                        <div>
                            <span className="text-gray-600 dark:text-accounting-dark-muted">New Configuration? </span>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-[#005a9e] dark:text-accounting-dark-accent hover:underline font-semibold focus:outline-none"
                            >
                                Initialize Profile
                            </button>
                        </div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-red-600 hover:text-red-800 hover:underline font-semibold focus:outline-none"
                        >
                            Admin Portal
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

export default Login;

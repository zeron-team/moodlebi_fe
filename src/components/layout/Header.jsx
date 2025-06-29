// --- Archivo: src/components/layout/Header.jsx ---
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-gray-800/80 backdrop-blur-sm text-white shadow-md z-20 sticky top-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white focus:outline-none lg:hidden mr-4">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-indigo-400">MoodleBI</h1>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-4 hidden sm:block">¡Hola, {user?.name}!</span>
                        <button onClick={logout} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            <LogOut size={18} className="mr-2" />
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
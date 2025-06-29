// --- Archivo: src/components/layout/Sidebar.jsx ---
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, ChevronRight, ChevronLeft } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, isSidebarExpanded, setIsSidebarExpanded }) => {
    const NavItem = ({ to, icon: Icon, text }) => (
        <li className="relative">
            <NavLink to={to} className={({ isActive }) => `flex items-center p-3 my-1 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                <Icon size={20} className="icon" />
                <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-40 ml-3' : 'w-0'}`}>{text}</span>
            </NavLink>
        </li>
    );

    return (
        <>
            <aside className={`bg-gray-800 text-gray-300 transition-all duration-300 ease-in-out z-30 fixed lg:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
                <div className="flex items-center justify-between h-16 p-4 border-b border-gray-700">
                     <span className={`font-bold text-white text-lg overflow-hidden transition-all ${isSidebarExpanded ? 'w-auto' : 'w-0'}`}>Menú</span>
                    <button onClick={() => setIsSidebarExpanded(p => !p)} className="p-2 rounded-full hover:bg-gray-700">
                        {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
                <nav className="p-2">
                    <ul>
                        <NavItem to="/dashboard" icon={LayoutDashboard} text="Dashboard" />
                        <NavItem to="/users" icon={Users} text="Usuarios" />
                        <NavItem to="/settings" icon={Settings} text="Ajustes" />
                    </ul>
                </nav>
            </aside>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        </>
    );
};
export default Sidebar;
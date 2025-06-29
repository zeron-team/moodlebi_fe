// --- Archivo: src/components/layout/MainLayout.jsx ---
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setIsSidebarOpen(o => !o)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};
export default MainLayout;
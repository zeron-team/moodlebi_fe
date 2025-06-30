// --- Archivo: src/components/layout/Footer.jsx ---
import React from 'react';

const Footer = () => (
    <footer className="bg-gray-800/80 backdrop-blur-sm text-gray-400 text-center p-4 shadow-inner mt-auto">
        <p>&copy; {new Date().getFullYear()} MoodleBI Platform by ZeRoN Todos los derechos reservados.</p>
    </footer>
);
export default Footer;
// --- Archivo: src/pages/NotFoundPage.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-9xl font-extrabold text-indigo-500">404</h1>
        <h2 className="text-4xl font-bold mt-4 mb-2">Página No Encontrada</h2>
        <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Volver al Dashboard
        </Link>
    </div>
);
export default NotFoundPage;
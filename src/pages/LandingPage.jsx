// --- Archivo: src/pages/LandingPage.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const LandingPage = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <nav className="p-6 flex justify-between items-center container mx-auto">
            <h1 className="text-2xl font-bold text-indigo-400">MoodleBI</h1>
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center">
                <LogIn size={18} className="mr-2"/>
                Iniciar Sesión
            </Link>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
             <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                Transforma los Datos de <span className="text-indigo-400">Moodle</span><br />en Decisiones Inteligentes
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Nuestra plataforma de Business Intelligence se conecta directamente a tu Moodle para ofrecerte dashboards interactivos, KPIs cruciales y análisis profundos que potenciarán tu estrategia de e-learning.
            </p>
            <div>
                <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                    Empezar Ahora
                </Link>
            </div>
        </main>
         <footer className="text-gray-400 text-center p-4">
            <p> &copy; {new Date().getFullYear()} MoodleBI Platform powered by{" "}
                <a
      href="https://zeron.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:underline"
    >
      ZeRoN
    </a>.
  </p>
</footer>
    </div>
);
export default LandingPage;
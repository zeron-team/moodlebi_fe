// --- Archivo: src/pages/LoginPage.jsx ---
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('admin@moodlebi.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Bienvenido a MoodleBI</h2>
                <p className="text-center text-gray-400 mb-8">Inicia sesión para acceder a tu dashboard.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-gray-500 flex items-center justify-center">
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Iniciar Sesión'}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm">Volver a la página principal</Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
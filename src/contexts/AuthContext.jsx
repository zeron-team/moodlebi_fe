// --- Archivo: src/contexts/AuthContext.jsx ---
import React, { useState, useEffect, createContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const { sub: email } = payload;

                    const mockUser = {
                        email,
                        name: email.split('@')[0],
                        role: email.includes('admin') ? 'admin' : 'viewer'
                    };
                    setUser(mockUser);
                } catch (error) {
                    console.error("Token inválido o sesión expirada.", error);
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        const response = await apiClient.post('/auth/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);

        navigate('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const authContextValue = useMemo(() => ({
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
    }), [user, token, loading]);

    if (loading && !token) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
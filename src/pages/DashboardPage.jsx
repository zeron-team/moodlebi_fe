// --- Archivo: src/pages/DashboardPage.jsx ---
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api.js';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserCheck, ShieldCheck, BarChart2 } from 'lucide-react';

const iconMap = {
    'Usuarios Activos (Últ. 30 días)': UserCheck,
    'Cursos Completados (Este mes)': ShieldCheck,
    'Tasa de Engagement Promedio': BarChart2
};

const KpiCard = ({ item }) => {
    const Icon = iconMap[item.title] || BarChart2;
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
            <div className="p-3 bg-indigo-500/80 rounded-full mr-4"><Icon size={24} className="text-white"/></div>
            <div>
                <p className="text-sm text-gray-400">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className={`text-sm ${item.change?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{item.change}</p>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get('/dashboard/');
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Error al cargar los datos del dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center p-10">Cargando datos del dashboard...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!data) return <div className="text-center p-10">No hay datos disponibles.</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Principal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.kpis.map(item => <KpiCard key={item.title} item={item} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Actividad de Usuarios</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.user_activity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Actividad" stroke="#818CF8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Tasa de Finalización por Curso</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.course_completion}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" angle={-15} textAnchor="end" height={50} interval={0}/>
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} cursor={{fill: '#2d3748'}}/>
                            <Legend />
                            <Bar dataKey="value" name="Finalización (%)" fill="#818CF8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default DashboardPage;
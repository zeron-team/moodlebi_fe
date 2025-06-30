// --- Archivo: src/pages/DashboardPage.jsx ---
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api.js';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { UserCheck, ShieldCheck, BarChart2, Clock } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

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

    const kpis = [
        ...data.kpis,
        { title: "Tiempo Promedio", value: "45 min", change: "+2 min", icon: Clock }
    ];

    const pieData = [{name: 'Activos', value: 1287}, {name: 'Inactivos', value: 345}];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Principal</h2>
            {/* Línea 1: 4 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} />)}
            </div>
            {/* Línea 2: 2 Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Actividad de Usuarios">
                    <LineChart data={data.user_activity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Actividad" stroke="#818CF8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ChartCard>
                <ChartCard title="Tasa de Finalización por Curso">
                    <BarChart data={data.course_completion}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" angle={-15} textAnchor="end" height={60} interval={0}/>
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} cursor={{fill: '#2d3748'}}/>
                        <Legend />
                        <Bar dataKey="value" name="Finalización (%)" fill="#818CF8" />
                    </BarChart>
                </ChartCard>
            </div>
             {/* Línea 3: 2 Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Distribución de Usuarios">
                     <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                    </PieChart>
                </ChartCard>
                 <ChartCard title="Nuevas Inscripciones">
                    <BarChart data={data.user_activity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} cursor={{fill: '#2d3748'}}/>
                        <Legend />
                        <Bar dataKey="value" name="Inscripciones" fill="#82ca9d" />
                    </BarChart>
                </ChartCard>
            </div>
        </div>
    );
};
export default DashboardPage;
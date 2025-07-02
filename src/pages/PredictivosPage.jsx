// --- Archivo: src/pages/PredictivosPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, UserMinus, Target, MapPin } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';
import apiClient from '../services/api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie } from 'recharts';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const PredictivosPage = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todos');
    const [inactivityDays, setInactivityDays] = useState(30);

    const debouncedInactivityDays = useDebounce(inactivityDays, 500);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/predictivos/?inactivity_days=${debouncedInactivityDays}`);
            setPageData(response.data);
        } catch (error) {
            console.error("Error fetching predictive data:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedInactivityDays]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="text-center p-10">Cargando análisis predictivo...</div>;
    if (!pageData) return <div className="text-center p-10">No hay datos disponibles.</div>;

    const { kpis, predicciones, risk_factors_distribution, activity_grade_correlation, risk_by_city, risk_level_distribution } = pageData;
    const iconMap = {"Estudiantes en Riesgo Alto": AlertTriangle, "Estudiantes en Riesgo Medio": UserMinus, "Factor de Riesgo Principal": Target, "Ciudad con Mayor Riesgo": MapPin};

    const riskFactorColors = { 'Bajo Rendimiento': '#FF8042', 'Inactividad Reciente': '#FFBB28' };
    const riskLevelColors = { 'Alto': '#ef4444', 'Medio': '#f59e0b', 'Bajo': '#22c55e' };
    const scatterColors = { 'Alto': '#ef4444', 'Medio': '#f59e0b', 'Bajo': '#22c55e'};

    const filteredStudents = predicciones.filter(student => {
        if (filter === 'Todos') return true;
        return student.main_factor === filter;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Análisis Predictivo de Deserción</h2>
                <div className="flex items-center gap-4">
                    <label htmlFor="inactivity" className="text-sm text-gray-400">Días de Inactividad:</label>
                    <input
                        type="number"
                        id="inactivity"
                        value={inactivityDays}
                        onChange={(e) => setInactivityDays(e.target.value)}
                        className="bg-gray-700 w-20 text-white px-2 py-1 rounded border border-gray-600"
                    />
                </div>
            </div>

            {/* Línea 1: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} icon={iconMap[item.title]}/>)}
            </div>
            {/* Línea 2: Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Principales Factores de Riesgo">
                     <BarChart data={risk_factors_distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº de Alumnos">
                            {risk_factors_distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={riskFactorColors[entry.name] || '#8884d8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>
                 <ChartCard title="Distribución de Niveles de Riesgo">
                    <PieChart>
                        <Pie data={risk_level_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {risk_level_distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={riskLevelColors[entry.name] || '#333'} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend/>
                    </PieChart>
                </ChartCard>
            </div>
             {/* Línea 3: Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <ChartCard title="Alumnos en Riesgo por Ciudad">
                    <BarChart data={risk_by_city}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº de Alumnos" fill="#82ca9d" />
                    </BarChart>
                </ChartCard>
                 <ChartCard title="Correlación Actividad vs. Calificación">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568"/>
                        <XAxis type="number" dataKey="logins" name="logins" label={{ value: "Nº de Logins", position: 'insideBottom', offset: -5 }} stroke="#a0aec0"/>
                        <YAxis type="number" dataKey="grade" name="grade" label={{ value: 'Calificación', angle: -90, position: 'insideLeft' }} stroke="#a0aec0"/>
                        <ZAxis type="number" range={[60, 400]} />
                        <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }}/>
                        <Scatter name="Alumnos" data={activity_grade_correlation}>
                             {activity_grade_correlation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={scatterColors[entry.risk] || '#8884d8'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ChartCard>
            </div>
            {/* Línea 4: Tabla de Intervención */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Alumnos con Mayor Riesgo</h3>
                    <div className="flex items-center gap-4">
                        <span>Filtrar por Factor:</span>
                        <select onChange={(e) => setFilter(e.target.value)} value={filter} className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="Todos">Todos</option>
                            <option value="Bajo Rendimiento">Bajo Rendimiento</option>
                            <option value="Inactividad Reciente">Inactividad Reciente</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-h-[60vh] overflow-y-auto">
                     <table className="w-full text-left">
                        <thead className="bg-gray-700 sticky top-0">
                            <tr>
                                <th className="p-4 font-semibold">Estudiante</th>
                                <th className="p-4 font-semibold">Curso</th>
                                <th className="p-4 font-semibold">Ciudad</th>
                                <th className="p-4 font-semibold">Puntaje de Riesgo</th>
                                <th className="p-4 font-semibold">Factor Principal</th>
                                <th className="p-4 font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={`${student.student_id}-${student.course_name}`} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-4">{student.student_name}</td>
                                    <td className="p-4">{student.course_name}</td>
                                    <td className="p-4">{student.city || 'N/D'}</td>
                                    <td className="p-4">
                                        <span className={`font-bold ${student.risk_score > 0.75 ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {(student.risk_score * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="p-4">{student.main_factor}</td>
                                    <td className="p-4">
                                        <button className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700">Contactar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default PredictivosPage;
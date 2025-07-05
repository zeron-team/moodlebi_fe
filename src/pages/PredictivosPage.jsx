// --- Archivo: src/pages/PredictivosPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, UserMinus, Target, MapPin, Info, ChevronUp, ChevronDown } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';
import apiClient from '../services/api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie } from 'recharts';
import CustomTooltip from '../components/ui/CustomTooltip.jsx';

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

const SortableHeader = ({ children, columnId, sortBy, sortDir, onSort }) => (
    <th className="p-4 font-semibold cursor-pointer hover:bg-gray-600" onClick={() => onSort(columnId)}>
        <div className="flex items-center gap-2">
            {children}
            {sortBy === columnId ? (sortDir === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : null}
        </div>
    </th>
);

const PredictivosPage = () => {
    const [pageData, setPageData] = useState({ kpis: [], predicciones: [], total_predicciones: 0, risk_factors_distribution: [], activity_grade_correlation: [], risk_by_city: [], risk_level_distribution: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('Todos');
    const [inactivityDays, setInactivityDays] = useState(30);
    const [sortBy, setSortBy] = useState('risk_score');
    const [sortDir, setSortDir] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedInactivityDays = useDebounce(inactivityDays, 500);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const ITEMS_PER_PAGE = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const params = new URLSearchParams({
            inactivity_days: debouncedInactivityDays,
            skip: offset,
            limit: ITEMS_PER_PAGE,
            sort_by: sortBy,
            sort_dir: sortDir,
        });
        if (filter !== 'Todos') {
            params.append('filter_factor', filter);
        }
        if (debouncedSearchTerm) {
            params.append('search', debouncedSearchTerm);
        }

        try {
            const response = await apiClient.get(`/predictivos/?${params.toString()}`);
            setPageData(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al cargar los datos predictivos.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedInactivityDays, sortBy, sortDir, filter, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSort = (column) => {
        const newSortDir = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newSortDir);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }

    if (loading && !pageData.kpis.length) return <div className="text-center p-10">Cargando análisis predictivo...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    const { kpis, predicciones, risk_factors_distribution, activity_grade_correlation, risk_by_city, risk_level_distribution, total_predicciones } = pageData;
    const totalPages = Math.ceil(total_predicciones / ITEMS_PER_PAGE) || 1;

    const iconMap = {"Estudiantes en Riesgo Alto": AlertTriangle, "Estudiantes en Riesgo Medio": UserMinus, "Factor de Riesgo Principal": Target, "Ciudad con Mayor Riesgo": MapPin};

    const riskFactorColors = { 'Bajo Rendimiento': '#FF8042', 'Inactividad Crítica': '#FFBB28', 'Baja Participación': '#00C49F', 'Múltiples Factores': '#8884d8' };
    const riskLevelColors = { 'Alto': '#ef4444', 'Medio Alto': '#f97316', 'Medio Bajo': '#f59e0b', 'Bajo': '#22c55e' };
    const scatterColors = { 'Alto': '#ef4444', 'Medio': '#f59e0b', 'Bajo': '#22c55e'};

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

            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg mb-8 flex items-start gap-3 group relative">
                <Info size={24} className="text-blue-400 mt-1 flex-shrink-0"/>
                <div>
                    <h4 className="font-bold text-white">¿Cómo funciona este dashboard?</h4>
                    <p className="text-sm text-gray-400">
                        Este panel utiliza un modelo de Machine Learning (Random Forest) para predecir la probabilidad de deserción.
                    </p>
                </div>
                 <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    El modelo analiza múltiples factores como la **inactividad**, las **calificaciones**, la **entrega de tareas** y la **participación en foros**. Los resultados le permiten identificar no solo *quién* está en riesgo, sino también *por qué*, facilitando una intervención temprana y efectiva.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} icon={iconMap[item.title]}/>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Principales Factores de Riesgo">
                     <BarChart data={risk_factors_distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
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
                        <Tooltip content={<CustomTooltip />} />
                        <Legend/>
                    </PieChart>
                </ChartCard>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <ChartCard title="Alumnos en Riesgo por Ciudad">
                    <BarChart data={risk_by_city}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }}/>
                        <Bar dataKey="value" name="Nº de Alumnos" fill="#82ca9d" />
                    </BarChart>
                </ChartCard>
                 <ChartCard title="Correlación Actividad vs. Calificación">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568"/>
                        <XAxis type="number" dataKey="logins" name="logins" label={{ value: "Nº de Logins", position: 'insideBottom', offset: -5 }} stroke="#a0aec0"/>
                        <YAxis type="number" dataKey="grade" name="grade" label={{ value: 'Calificación', angle: -90, position: 'insideLeft' }} stroke="#a0aec0"/>
                        <ZAxis type="number" range={[60, 400]} />
                        <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomTooltip />}/>
                        <Scatter name="Alumnos" data={activity_grade_correlation}>
                             {activity_grade_correlation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={scatterColors[entry.risk] || '#8884d8'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ChartCard>
            </div>
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Listado de Alumnos</h3>
                    <div className="flex items-center gap-4">
                         <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select onChange={handleFilterChange} value={filter} className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="Todos">Todos los Factores</option>
                            <option value="Bajo Rendimiento">Bajo Rendimiento</option>
                            <option value="Inactividad Crítica">Inactividad Crítica</option>
                            <option value="Baja Participación">Baja Participación</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700 sticky top-0">
                                <tr>
                                    <SortableHeader columnId="student_name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Estudiante</SortableHeader>
                                    <SortableHeader columnId="city" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Ciudad</SortableHeader>
                                    <SortableHeader columnId="risk_score" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Puntaje de Riesgo</SortableHeader>
                                    <SortableHeader columnId="main_factor" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Factor Principal</SortableHeader>
                                    <th className="p-4 font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predicciones.map((student) => (
                                    <tr key={`${student.student_id}-${student.course_name}`} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-4">{student.student_name}</td>
                                        <td className="p-4">{student.city || 'N/D'}</td>
                                        <td className="p-4">
                                            <span className={`font-bold ${student.risk_level === 'Alto' ? 'text-red-400' : student.risk_level === 'Medio Alto' ? 'text-orange-400' : student.risk_level === 'Medio Bajo' ? 'text-yellow-400' : 'text-green-400'}`}>
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
                    <div className="flex justify-between items-center p-4 bg-gray-800">
                        <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({total_predicciones} resultados)</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600">Anterior</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || loading} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600">Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PredictivosPage;
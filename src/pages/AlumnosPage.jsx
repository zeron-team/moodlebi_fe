// --- Archivo: src/pages/AlumnosPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, UserPlus, TrendingUp, ListChecks, ChevronUp, ChevronDown } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';
import apiClient from '../services/api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const SortableHeader = ({ children, columnId, sortBy, sortDir, onSort }) => (
    <th className="p-4 font-semibold cursor-pointer" onClick={() => onSort(columnId)}>
        <div className="flex items-center gap-2">
            {children}
            {sortBy === columnId ? (sortDir === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : null}
        </div>
    </th>
);

const AlumnosPage = () => {
    const [pageData, setPageData] = useState({ kpis: [], listado_alumnos: [], total_alumnos: 0, nuevos_alumnos_por_mes: [], alumnos_por_categoria: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('lastname');
    const [sortDir, setSortDir] = useState('asc');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const ITEMS_PER_PAGE = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const offset = (currentPage - 1) * ITEMS_PER_PAGE;
            const params = new URLSearchParams({
                skip: offset,
                limit: ITEMS_PER_PAGE,
                sort_by: sortBy,
                sort_dir: sortDir,
            });
            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }

            const response = await apiClient.get(`/alumnos/?${params.toString()}`);
            setPageData(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al cargar los datos de alumnos.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, sortBy, sortDir]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSort = (column) => {
        const newSortDir = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newSortDir);
        setCurrentPage(1);
    };

    const totalPages = pageData ? Math.ceil(pageData.total_alumnos / ITEMS_PER_PAGE) : 0;
    const iconMap = {"Total de Alumnos": GraduationCap, "Nuevos Alumnos (Mes)": UserPlus, "Tasa Finalización (Prom.)": TrendingUp, "Tareas Entregadas": ListChecks };

    if (loading && !pageData.kpis.length) return <div className="text-center p-10">Cargando datos de alumnos...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard de Alumnos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {(pageData.kpis || []).map(item => <KpiCard key={item.title} {...item} icon={iconMap[item.title]}/>)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <ChartCard title="Nuevos Alumnos por Mes">
                    <BarChart data={pageData.nuevos_alumnos_por_mes || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nuevos Alumnos" fill="#8884d8" />
                    </BarChart>
                </ChartCard>
                <ChartCard title="Alumnos por Categoría de Cursos">
                    <BarChart data={pageData.alumnos_por_categoria || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis allowDecimals={false} stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº Alumnos" fill="#82ca9d" />
                    </BarChart>
                </ChartCard>
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Listado Completo de Alumnos</h3>
                    <input
                        type="text"
                        placeholder="Buscar alumnos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700">
                                <tr>
                                    <SortableHeader columnId="id" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>ID</SortableHeader>
                                    <SortableHeader columnId="firstname" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Nombre</SortableHeader>
                                    <SortableHeader columnId="lastname" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Apellido</SortableHeader>
                                    <SortableHeader columnId="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort}>Email</SortableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && !pageData.listado_alumnos.length ? (
                                    <tr><td colSpan="4" className="text-center p-8">Cargando...</td></tr>
                                ) : (
                                    pageData.listado_alumnos.map(alumno => (
                                        <tr key={alumno.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-4">{alumno.id}</td>
                                            <td className="p-4">{alumno.firstname}</td>
                                            <td className="p-4">{alumno.lastname}</td>
                                            <td className="p-4">{alumno.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-800">
                        <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({pageData.total_alumnos} resultados)</span>
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
export default AlumnosPage;
// --- Archivo: src/pages/PredictivosPage.jsx ---
import React, { useState, useEffect } from 'react';
import { AlertTriangle, UserMinus, Target, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';

const COLORS = ['#FF8042', '#FFBB28', '#00C49F'];
const PredictivosPage = () => {
    const [kpis, setKpis] = useState([]);
    const [charts, setCharts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setKpis([
                { title: "Estudiantes en Riesgo Alto", value: "32", icon: AlertTriangle, change: "+3" },
                { title: "Porcentaje de Riesgo Alto", value: "8%", icon: UserMinus, change: "+0.5%" },
                { title: "Intervenciones Realizadas", value: "15", icon: Target },
                { title: "Tasa de Éxito Post-Intervención", value: "67%", icon: CheckCircle }
            ]);
            setCharts({
                distribucionRiesgo: [{name: 'Alto', value: 32}, {name: 'Medio', value: 78}, {name: 'Bajo', value: 390}],
                riesgoPorCurso: [{name: 'Cálculo I', value: 15}, {name: 'Física II', value: 12}, {name: 'Química Org.', value: 8}, {name: 'Historia', value: 2}],
                evolucionRiesgo: [{name: 'T1', value: 25}, {name: 'T2', value: 28}, {name: 'T3', value: 30}, {name: 'T4', value: 32}],
                factoresRiesgo: [{name: 'Bajas Calif.', value: 45}, {name: 'Poca Actividad', value: 30}, {name: 'Tareas Atrasadas', value: 25}],
            });
            setLoading(false);
        }, 1000);
    }, []);

     if (loading) return <div className="text-center p-10">Cargando datos predictivos...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Predictivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} />)}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Distribución de Niveles de Riesgo">
                    <PieChart>
                        <Pie data={charts.distribucionRiesgo} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" label>
                            {charts.distribucionRiesgo.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                    </PieChart>
                </ChartCard>
                 <ChartCard title="Estudiantes en Riesgo por Curso">
                    <BarChart data={charts.riesgoPorCurso} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis type="number" stroke="#a0aec0" />
                        <YAxis type="category" dataKey="name" stroke="#a0aec0" width={100}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº Estudiantes" fill="#FF8042" />
                    </BarChart>
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Evolución del Riesgo Alto (Trimestral)">
                    <LineChart data={charts.evolucionRiesgo}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Line type="monotone" dataKey="value" name="Estudiantes" stroke="#FF8042" />
                    </LineChart>
                </ChartCard>
                <ChartCard title="Principales Factores de Riesgo">
                     <BarChart data={charts.factoresRiesgo}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Incidencia" fill="#00C49F" />
                    </BarChart>
                </ChartCard>
            </div>
        </div>
    );
};
export default PredictivosPage;
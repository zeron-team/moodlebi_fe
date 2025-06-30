// --- Archivo: src/pages/CursosPage.jsx ---
import React, { useState, useEffect } from 'react';
import { BookCopy, Layers } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
const CursosPage = () => {
    const [kpis, setKpis] = useState([]);
    const [charts, setCharts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCursosData = async () => {
            setLoading(true);
            // Simulación de llamada a API
            setTimeout(() => {
                setKpis([
                    { title: "Total de Cursos", value: "128", icon: BookCopy, change: "+5" },
                    { title: "Cursos Activos", value: "95", icon: Layers, change: "-1" },
                    { title: "Inscripciones (Mes)", value: "1,430", icon: Layers, change: "+15%" },
                    { title: "Tasa de Finalización", value: "72%", icon: Layers, change: "+1.2%" }
                ]);
                setCharts({
                    inscripciones: [{name: 'Ene', value: 300}, {name: 'Feb', value: 450}, {name: 'Mar', value: 600}, {name: 'Abr', value: 550}, {name: 'May', value: 720}, {name: 'Jun', value: 830}],
                    categorias: [{name: 'Tecnología', value: 45}, {name: 'Negocios', value: 30}, {name: 'Arte', value: 25}, {name: 'Salud', value: 28}],
                    distribucion: [{name: 'Completado', value: 400}, {name: 'En Progreso', value: 300}, {name: 'No Iniciado', value: 100}],
                    actividad: [{name: 'Intro a Moodle', value: 500}, {name: 'Gamificación', value: 800}, {name: 'Seguridad Web', value: 300}],
                });
                setLoading(false);
            }, 1000);
        };
        fetchCursosData();
    }, []);

    if (loading) return <div className="text-center p-10">Cargando datos de cursos...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard de Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Inscripciones por Mes">
                    <LineChart data={charts.inscripciones}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Inscripciones" stroke="#8884d8" />
                    </LineChart>
                </ChartCard>
                <ChartCard title="Cursos por Categoría">
                    <BarChart data={charts.categorias}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                        <Bar dataKey="value" name="Nº Cursos" fill="#82ca9d" />
                    </BarChart>
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Distribución de Estudiantes">
                     <PieChart>
                        <Pie data={charts.distribucion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {charts.distribucion.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                    </PieChart>
                </ChartCard>
                <ChartCard title="Actividad en Foros por Curso">
                    <BarChart data={charts.actividad} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis type="number" stroke="#a0aec0" />
                        <YAxis type="category" dataKey="name" stroke="#a0aec0" width={120} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Legend />
                        <Bar dataKey="value" name="Publicaciones" fill="#ffc658" />
                    </BarChart>
                </ChartCard>
            </div>
        </div>
    );
};
export default CursosPage;
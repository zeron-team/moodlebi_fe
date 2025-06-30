// --- Archivo: src/pages/DocentesPage.jsx ---
import React, { useState, useEffect } from 'react';
import { Users, Book, Award, MessageSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import KpiCard from '../components/ui/KpiCard.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';

const DocentesPage = () => {
    const [kpis, setKpis] = useState([]);
    const [charts, setCharts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setKpis([
                { title: "Total de Docentes", value: "42", icon: Users, change: "+2" },
                { title: "Cursos por Docente", value: "3.1", icon: Book, change: "+0.2" },
                { title: "Feedback Promedio", value: "4.8/5", icon: Award, change: "+0.1" },
                { title: "Actividad en Foros", value: "215", icon: MessageSquare, change: "+12%" }
            ]);
            setCharts({
                cursosAsignados: [{name: 'A. Pérez', value: 5}, {name: 'M. Gómez', value: 3}, {name: 'L. Nuñez', value: 4}, {name: 'J. García', value: 2}, {name: 'S. López', value: 4}],
                actividadSemanal: [{name: 'Lun', value: 20}, {name: 'Mar', value: 35}, {name: 'Mié', value: 40}, {name: 'Jue', value: 32}, {name: 'Vie', value: 50}],
                feedback: [{subject: 'Claridad', A: 110, fullMark: 150}, {subject: 'Materiales', A: 98, fullMark: 150}, {subject: 'Disponibilidad', A: 86, fullMark: 150}, {subject: 'Dinamismo', A: 99, fullMark: 150}, {subject: 'Evaluación', A: 120, fullMark: 150}],
                calificaciones: [{name: 'Ene', value: 1200}, {name: 'Feb', value: 1500}, {name: 'Mar', value: 2100}, {name: 'Abr', value: 1800}, {name: 'May', value: 2500}, {name: 'Jun', value: 2800}],
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="text-center p-10">Cargando datos de docentes...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard de Docentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(item => <KpiCard key={item.title} {...item} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Cursos Asignados por Docente">
                    <BarChart data={charts.cursosAsignados}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº Cursos" fill="#8884d8" />
                    </BarChart>
                </ChartCard>
                <ChartCard title="Actividad Semanal (Logins)">
                    <LineChart data={charts.actividadSemanal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Line type="monotone" dataKey="value" name="Logins" stroke="#82ca9d" />
                    </LineChart>
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Feedback de Estudiantes">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={charts.feedback}>
                        <PolarGrid stroke="#4a5568"/>
                        <PolarAngleAxis dataKey="subject" stroke="#a0aec0" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#a0aec0"/>
                        <Radar name="Feedback" dataKey="A" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                         <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                    </RadarChart>
                </ChartCard>
                <ChartCard title="Calificaciones Otorgadas por Mes">
                     <BarChart data={charts.calificaciones}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Bar dataKey="value" name="Nº Calificaciones" fill="#ff8042" />
                    </BarChart>
                </ChartCard>
            </div>
        </div>
    );
};
export default DocentesPage;
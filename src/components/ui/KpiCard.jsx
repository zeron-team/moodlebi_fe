// --- Archivo: src/components/ui/KpiCard.jsx ---

import React from 'react';
import { BarChart2 } from 'lucide-react';

const KpiCard = ({ title, value, change, icon: Icon = BarChart2 }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div className="p-3 bg-indigo-500/80 rounded-full mr-4">
            <Icon size={24} className="text-white"/>
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && <p className={`text-sm ${change?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</p>}
        </div>
    </div>
);
export default KpiCard;
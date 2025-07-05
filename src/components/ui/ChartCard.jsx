// --- Archivo: src/components/ui/ChartCard.jsx ---

import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
            {children}
        </ResponsiveContainer>
    </div>
);
export default ChartCard;
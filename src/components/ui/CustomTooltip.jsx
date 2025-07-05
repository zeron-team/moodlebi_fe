// --- Archivo: src/components/ui/CustomTooltip.jsx ---

import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 shadow-lg">
                <p className="font-bold text-indigo-400">{label}</p>
                {payload.map((pld, index) => (
                    <div key={index} style={{ color: pld.color || pld.fill }}>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
export default CustomTooltip;
import React from 'react';
import { Handle } from 'reactflow';

const CalculatorNode = ({ data }) => {
  const { calculator, application, stationName } = data;

  const getCalculatorIcon = () => {
    if (application?.toLowerCase().includes('etl')) {
      return '🔄'; // ETL icon
    } else if (application?.toLowerCase().includes('quality')) {
      return '✅'; // Quality check icon
    } else if (application?.toLowerCase().includes('ml')) {
      return '🤖'; // ML icon
    } else if (application?.toLowerCase().includes('api')) {
      return '🌐'; // API icon
    } else {
      return '⚙️'; // Default calculator icon
    }
  };

  return (
    <div 
      className="px-4 py-3 rounded-xl border-2 text-sm font-medium bg-gray-900 border-gray-700 shadow-lg text-white hover:scale-105 transition-all duration-200 cursor-pointer min-w-[120px]"
    >
      <Handle type="target" position="left" className="handle" />
      
      <div className="flex items-center space-x-2">
        <div className="text-lg">{getCalculatorIcon()}</div>
        <div className="flex-1">
          <div className="font-bold truncate">{stationName || calculator?.name}</div>
          <div className="text-xs opacity-80">{application || 'Unknown App'}</div>
          <div className="text-xs opacity-60">Calculator</div>
        </div>
      </div>
      
      <Handle type="source" position="right" className="handle" />
    </div>
  );
};

export default CalculatorNode;

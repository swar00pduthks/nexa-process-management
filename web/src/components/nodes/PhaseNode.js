import React from 'react';
import { Handle } from 'reactflow';

const PhaseNode = ({ data }) => {
  const { phase, calculators, subPhases, trackNumber, level, isJunction, stationName, onClick } = data;

  const getActionIcon = () => {
    if (subPhases && subPhases.length > 0) {
      return '🔄'; // Branch/Interchange icon
    } else if (calculators && calculators.length > 0) {
      return '⚙️'; // Processing icon
    } else {
      return '🚉'; // Station icon
    }
  };

  const getActionText = () => {
    if (subPhases && subPhases.length > 0) {
      return `${subPhases.length} Branches`;
    } else if (calculators && calculators.length > 0) {
      return `${calculators.length} Tasks`;
    } else {
      return 'Direct Route';
    }
  };

  return (
    <div 
      className="px-4 py-3 rounded-xl border-2 text-sm font-medium bg-gray-900 border-gray-700 shadow-lg text-white hover:scale-105 transition-all duration-200 cursor-pointer min-w-[120px]"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Handle type="target" position="left" className="handle" />
      
      <div className="flex items-center space-x-2">
        <div className="text-lg">{getActionIcon()}</div>
        <div className="flex-1">
          <div className="font-bold truncate">{stationName}</div>
          <div className="text-xs opacity-80">{getActionText()}</div>
          <div className="text-xs opacity-60">Phase {trackNumber}</div>
        </div>
      </div>
      
      <Handle type="source" position="right" className="handle" />
    </div>
  );
};

export default PhaseNode;


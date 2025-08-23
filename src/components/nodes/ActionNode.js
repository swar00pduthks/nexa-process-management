import React from 'react';
import { Handle } from 'reactflow';

const ActionNode = ({ data }) => {
  const { action, isDestination, stationName } = data;

  const getActionIcon = () => {
    if (isDestination) {
      return '🎯'; // Destination icon
    } else if (action?.eventType === 'business-process-completed') {
      return '✅'; // Completion icon
    } else {
      return '⚡'; // Action icon
    }
  };

  const getActionText = () => {
    if (isDestination) {
      return 'Final Destination';
    } else if (action?.eventType) {
      return action.eventType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else {
      return 'Process Action';
    }
  };

  return (
    <div 
      className="px-4 py-3 rounded-xl border-2 text-sm font-medium bg-gray-900 border-gray-700 shadow-lg text-white hover:scale-105 transition-all duration-200 cursor-pointer min-w-[120px]"
      style={{ 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Handle type="target" position="left" className="handle" />
      
      <div className="flex items-center space-x-2">
        <div className="text-lg">{getActionIcon()}</div>
        <div className="flex-1">
          <div className="font-bold truncate">{stationName}</div>
          <div className="text-xs opacity-80">{getActionText()}</div>
          <div className="text-xs opacity-60">Action Node</div>
        </div>
      </div>
      
      <Handle type="source" position="right" className="handle" />
    </div>
  );
};

export default ActionNode;

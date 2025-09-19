/**
 * ProgressBar - Progress indicator component
 * Shows completion progress with smooth animations
 */

import React from 'react';

const ProgressBar = ({ progress, showPercentage = false, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

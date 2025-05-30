import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const RainbowFlagIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e40303" />
          <stop offset="16.67%" stopColor="#ff8c00" />
          <stop offset="33.33%" stopColor="#ffed00" />
          <stop offset="50%" stopColor="#008018" />
          <stop offset="66.67%" stopColor="#0066ff" />
          <stop offset="83.33%" stopColor="#732982" />
        </linearGradient>
      </defs>
      <rect 
        x="3" 
        y="5" 
        width="18" 
        height="12" 
        rx="1" 
        fill="url(#rainbow-gradient)" 
        stroke="currentColor" 
        strokeWidth="0.5"
      />
    </SvgIcon>
  );
};

export default RainbowFlagIcon; 
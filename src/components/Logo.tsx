import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 60"
        className="w-full h-full drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(212, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(212, 0, 0, 0.3)) drop-shadow(0 0 30px rgba(212, 0, 0, 0.1))'
        }}
      >
        {/* Glow effect background */}
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF0000" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D40000" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F0F0F0" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Flame/Eagle wing shape */}
        <path
          d="M15 45 C20 35, 25 25, 35 20 C40 15, 45 12, 50 15 C45 20, 40 25, 35 30 C30 35, 25 40, 20 45 Z"
          fill="url(#redGlow)"
          filter="url(#glow)"
          className="animate-pulse"
        />
        <path
          d="M20 40 C25 30, 30 20, 40 15 C45 10, 50 8, 55 12 C50 17, 45 22, 40 27 C35 32, 30 37, 25 42 Z"
          fill="url(#redGlow)"
          filter="url(#glow)"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <path
          d="M25 35 C30 25, 35 15, 45 10 C50 5, 55 3, 60 8 C55 13, 50 18, 45 23 C40 28, 35 33, 30 38 Z"
          fill="url(#redGlow)"
          filter="url(#glow)"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Text ACADEMIA */}
        <text
          x="75"
          y="25"
          fontSize="14"
          fontWeight="bold"
          fill="url(#textGradient)"
          filter="url(#glow)"
          className="font-sans tracking-wider"
        >
          ACADEMIA
        </text>
        
        {/* Text GAVIÕES */}
        <text
          x="75"
          y="42"
          fontSize="18"
          fontWeight="bold"
          fill="url(#textGradient)"
          filter="url(#glow)"
          className="font-sans tracking-wider"
        >
          GAVIÕES
        </text>
        
        {/* Subtitle */}
        <text
          x="75"
          y="55"
          fontSize="8"
          fill="#FF4444"
          filter="url(#glow)"
          className="font-sans tracking-widest opacity-80"
        >
          CHECKLIST SYSTEM
        </text>
      </svg>
    </div>
  );
};

export default Logo;
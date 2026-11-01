import React from 'react';

interface StrMonogramProps {
  className?: string;
  glow?: boolean;
  variant?: 'gold' | 'subtle' | 'cyan-gold';
}

/**
 * Custom Interlocking Double-Line Geometric "STR" Monogram
 * Modeled after the official STR LEGACY brand mark.
 */
export const StrMonogram: React.FC<StrMonogramProps> = ({
  className = 'w-16 h-10',
  glow = false,
  variant = 'gold',
}) => {
  const uniqueId = React.useId();

  return (
    <svg
      viewBox="0 0 260 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="STR Legacy Interlocking Monogram"
    >
      <defs>
        <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d97e" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9e7b1c" />
        </linearGradient>
        <linearGradient id={`cyanGoldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#e5c158" />
        </linearGradient>
        {glow && (
          <filter id={`glowFilter-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      <g
        filter={glow ? `url(#glowFilter-${uniqueId})` : undefined}
        stroke={
          variant === 'subtle'
            ? 'rgba(212, 175, 55, 0.22)'
            : variant === 'cyan-gold'
            ? `url(#cyanGoldGrad-${uniqueId})`
            : `url(#goldGrad-${uniqueId})`
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer architectural track of S -> T -> R interlocking ribbon */}
        <path
          d="M 92 22 H 44 C 26 22 18 33 18 45 C 18 58 28 65 48 68 L 68 71 C 82 73 88 80 88 90 C 88 100 79 106 62 106 H 16"
          strokeWidth="8.5"
        />
        {/* Inner parallel ribbon of S */}
        <path
          d="M 84 36 H 46 C 35 36 31 40 31 46 C 31 52 36 55 52 57 L 70 60 C 90 63 102 74 102 90 C 102 106 88 116 64 116 H 22"
          strokeWidth="5"
          opacity="0.85"
        />

        {/* Central T crossbar & vertical stem interlocking with S and R */}
        <path
          d="M 88 22 H 174 M 126 22 V 94 C 126 105 135 108 144 100 L 168 74"
          strokeWidth="8.5"
        />
        <path
          d="M 112 36 V 98 C 112 110 124 116 138 110"
          strokeWidth="5"
          opacity="0.85"
        />

        {/* Interlocking R loop and diagonal leg */}
        <path
          d="M 156 36 H 204 C 224 36 236 47 236 62 C 236 77 224 88 202 88 H 174 L 216 112"
          strokeWidth="8.5"
        />
        <path
          d="M 164 50 H 200 C 212 50 220 55 220 62 C 220 69 212 74 200 74 H 158 L 196 112"
          strokeWidth="5"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};

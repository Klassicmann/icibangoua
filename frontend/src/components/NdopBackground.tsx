"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NdopBackground({
  opacityLight = 0.08,
  opacityDark = 0.02,
}: {
  opacityLight?: number;
  opacityDark?: number;
}) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a generic transparent div on server
    return <div className="absolute inset-0 z-0 pointer-events-none opacity-0"></div>;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Light mode uses deep Ndop blue, dark mode uses white
  const strokeColor = isDark ? "#ffffff" : "#132c52";
  const bgOpacity = isDark ? opacityDark : opacityLight;
  const patternId = `ndop-pattern-${isDark ? 'dark' : 'light'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id={patternId} 
            x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse"
          >
            <g 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Grid Lines */}
              <rect x="0" y="0" width="300" height="300" />
              <line x1="150" y1="0" x2="150" y2="300" />
              <line x1="0" y1="150" x2="300" y2="150" />
              
              {/* Circles with Crosses */}
              <g transform="translate(75, 75)">
                <circle cx="0" cy="0" r="45" />
                <circle cx="0" cy="0" r="30" />
                <line x1="-45" y1="0" x2="45" y2="0" />
                <line x1="0" y1="-45" x2="0" y2="45" />
                <circle cx="0" cy="0" r="9" fill={strokeColor} />
              </g>
              <g transform="translate(225, 225)">
                <circle cx="0" cy="0" r="45" />
                <circle cx="0" cy="0" r="30" />
                <line x1="-45" y1="0" x2="45" y2="0" />
                <line x1="0" y1="-45" x2="0" y2="45" />
                <circle cx="0" cy="0" r="9" fill={strokeColor} />
              </g>
              
              {/* Ndop Diamonds */}
              <g transform="translate(225, 75)">
                <path d="M0 -52 L52 0 L0 52 L-52 0 Z" />
                <path d="M0 -30 L30 0 L0 30 L-30 0 Z" />
                <circle cx="0" cy="0" r="6" fill={strokeColor} />
              </g>
              <g transform="translate(75, 225)">
                <path d="M0 -52 L52 0 L0 52 L-52 0 Z" />
                <path d="M0 -30 L30 0 L0 30 L-30 0 Z" />
                <circle cx="0" cy="0" r="6" fill={strokeColor} />
              </g>
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} opacity={bgOpacity} />
      </svg>
    </div>
  );
}

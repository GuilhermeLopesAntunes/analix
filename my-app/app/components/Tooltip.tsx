'use client';

import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
}

export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  maxWidth = '300px',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  // Estilos baseados na posição
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  // Setas baseados na posição
  const arrowStyles = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-black dark:border-t-white',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-black dark:border-b-white',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-black dark:border-l-white',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-black dark:border-r-white',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && content && (
        <div
          className={`absolute z-50 ${positionStyles[position]}`}
          style={{ maxWidth }}
        >

          <div className="relative">
     
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowStyles[position]}`}
            />
   
            <div className="bg-black dark:bg-white text-white dark:text-black text-sm rounded-lg p-3 shadow-lg">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
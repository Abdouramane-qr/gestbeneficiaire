import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300
}) => {
  const [active, setActive] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  // Gérer l'affichage et le masquage du tooltip avec délai
  const showTip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActive(false);
  };

  // Gérer les interactions tactiles
  const handleTouchStart = () => {
    setTouchActive(true);
    showTip();
  };

  const handleTouchEnd = () => {
    setTouchActive(false);
    hideTip();
  };

  // Ajuster la position du tooltip pour qu'il reste visible
  useEffect(() => {
    const adjustPosition = () => {
      if (active && tooltipRef.current && childrenRef.current) {
        const tooltip = tooltipRef.current;
        const wrapper = childrenRef.current;
        const wrapperRect = wrapper.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Calculer les positions par défaut
        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = -tooltipRect.height - 10;
            left = (wrapperRect.width - tooltipRect.width) / 2;
            break;
          case 'bottom':
            top = wrapperRect.height + 10;
            left = (wrapperRect.width - tooltipRect.width) / 2;
            break;
          case 'left':
            top = (wrapperRect.height - tooltipRect.height) / 2;
            left = -tooltipRect.width - 10;
            break;
          case 'right':
            top = (wrapperRect.height - tooltipRect.height) / 2;
            left = wrapperRect.width + 10;
            break;
        }

        // Vérifier si le tooltip dépasse de l'écran
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const absoluteLeft = wrapperRect.left + left;
        const absoluteTop = wrapperRect.top + top;

        // Ajuster horizontalement si nécessaire
        if (absoluteLeft < 0) {
          left = left - absoluteLeft + 5;
        } else if (absoluteLeft + tooltipRect.width > viewportWidth) {
          left = left - (absoluteLeft + tooltipRect.width - viewportWidth) - 5;
        }

        // Ajuster verticalement si nécessaire
        if (absoluteTop < 0) {
          top = top - absoluteTop + 5;
        } else if (absoluteTop + tooltipRect.height > viewportHeight) {
          top = top - (absoluteTop + tooltipRect.height - viewportHeight) - 5;
        }

        // Appliquer les positions ajustées
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      }
    };

    window.addEventListener('resize', adjustPosition);
    window.addEventListener('scroll', adjustPosition);

    // Appliquer après un court délai pour être sûr que le DOM est prêt
    if (active) {
      setTimeout(adjustPosition, 0);
    }

    return () => {
      window.removeEventListener('resize', adjustPosition);
      window.removeEventListener('scroll', adjustPosition);
    };
  }, [active, position]);

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={childrenRef}
    >
      {children}

      {active && (
        <div
          className={`absolute z-50 py-1 px-2 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 ${
            active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            maxWidth: '200px',
            wordBreak: 'break-word'
          }}
          ref={tooltipRef}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

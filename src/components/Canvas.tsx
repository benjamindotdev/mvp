'use client';

import React from 'react';
import { Layer } from '@/types/layer';
import { getIconById } from '@/lib/icons';

interface CanvasProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  size?: number;
}

const Canvas: React.FC<CanvasProps> = ({ layers, selectedLayerId, onSelectLayer, size = 512 }) => {
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      className="relative bg-white shadow-lg border border-gray-200" 
      style={{ width: size, height: size }}
    >
        {/* Grid background for transparency guide */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }} 
        />

      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {sortedLayers.map((layer) => {
          const iconDef = getIconById(layer.iconId);
          if (!iconDef) return null;
          const Icon = iconDef.component;
          const isSelected = layer.id === selectedLayerId;

          return (
            <g 
              key={layer.id}
              transform={`translate(${layer.x} ${layer.y}) rotate(${layer.rotate}) scale(${layer.scale}) translate(-12 -12)`} // Center the 24x24 icon
              opacity={layer.opacity}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLayer(layer.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon 
                size={24} 
                color={layer.color} 
                strokeWidth={2}
                className={isSelected ? "drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]" : ""} 
              />
              {isSelected && (
                 <rect x="-2" y="-2" width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Canvas;

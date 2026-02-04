import { Layer } from '@/types/layer';
import { renderToStaticMarkup } from 'react-dom/server';
import { getIconById } from './icons';
import React from 'react';

export const generateSvg = (layers: Layer[], size = 512): string => {
  // Sort layers by zIndex
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  const svgContent = sortedLayers.map(layer => {
    const iconDef = getIconById(layer.iconId);
    if (!iconDef) return '';

    // Create the icon element
    const IconComponent = iconDef.component;
    const iconElement = React.createElement(IconComponent, {
        size: 24, // Base size from Lucide
        color: layer.color,
        strokeWidth: 2,
    });

    // Render icon to string to extract path/content if needed, or wrap in group with transform
    // But rendering actual React components inside a static SVG string generation is tricky without SSR tools.
    // However, since we are client side, we can use `renderToStaticMarkup`.
    
    const markup = renderToStaticMarkup(iconElement);
    // extract inner content of svg or just use it as is?
    // Lucide returns an <svg> element. We want to embed it.
    // We can wrap it in a <g> with transform.
    
    // Parse the markup to remove the outer <svg> tag if we want to be clean, 
    // or just use <g transform> around the <svg> (valid in SVG 2, mostly works).
    // Better: extract attributes and content.
    // But for MVP, nesting <svg> inside <g> is standard and works well for transforms.
    
    // Transform center: 
    // We want the rotation/scale to be around the center of the icon.
    // The icon is 24x24. Center is 12,12.
    // We place it at x,y (center of canvas is 256,256 presumably, or mapped).
    
    // Let's assume input x, y are coordinates in the `size` canvas space.
    // We need to translate to (x, y), then rotate, then scale.
    // And offset by -12, -12 to center the icon.
    
    return `
      <g transform="translate(${layer.x} ${layer.y}) rotate(${layer.rotate}) scale(${layer.scale}) translate(-12 -12)" opacity="${layer.opacity}">
        ${markup}
      </g>
    `;
  }).join('');

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
${svgContent}
</svg>
  `.trim();
};

export const downloadSvg = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

'use client';

import React from 'react';
import { Layer } from '@/types/layer';
import { generateSvg, downloadSvg } from '@/lib/exportSvg';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  layers: Layer[];
  onAfterExport?: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ layers, onAfterExport }) => {
  const handleExport = () => {
    const defaultName = 'mvp-icon';
    const input = window.prompt('Name your SVG', defaultName);
    if (!input) return;

    const trimmed = input.trim() || defaultName;
    const filename = trimmed.toLowerCase().endsWith('.svg') ? trimmed : `${trimmed}.svg`;
    const svgContent = generateSvg(layers);
    downloadSvg(svgContent, filename);
    onAfterExport?.();
  };

  return (
    <Button onClick={handleExport} className="gap-2" size="sm">
      <Download size={16} />
      Save SVG
    </Button>
  );
};

export default ExportButton;

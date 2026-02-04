'use client';

import React from 'react';
import { Layer } from '@/types/layer';
import { Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface LayerControlsProps {
  layer: Layer;
  onUpdate: (changes: Partial<Layer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ 
  layer, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown 
}) => {
  return (
    <div className="p-4 bg-muted/30 border-t border-border space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground">Selected Layer</h3>
        <div className="flex gap-1">
             <Button onClick={onMoveDown} variant="ghost" size="icon" title="Move Down"><ArrowDown size={16} /></Button>
             <Button onClick={onMoveUp} variant="ghost" size="icon" title="Move Up"><ArrowUp size={16} /></Button>
             <Button onClick={onDuplicate} variant="ghost" size="icon" title="Duplicate"><Copy size={16} /></Button>
             <Button onClick={onDelete} variant="ghost" size="icon" className="text-destructive" title="Delete"><Trash2 size={16} /></Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2">X Position</Label>
          <Slider
            value={[layer.x]}
            min={0}
            max={512}
            step={1}
            onValueChange={(value) => onUpdate({ x: value[0] ?? 0 })}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{layer.x}</span>
            <span>512</span>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2">Y Position</Label>
          <Slider
            value={[layer.y]}
            min={0}
            max={512}
            step={1}
            onValueChange={(value) => onUpdate({ y: value[0] ?? 0 })}
          />
           <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{layer.y}</span>
            <span>512</span>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2">Scale</Label>
          <Slider
            value={[layer.scale]}
            min={0.5}
            max={10}
            step={0.1}
            onValueChange={(value) => onUpdate({ scale: value[0] ?? 1 })}
          />
          <div className="text-right text-xs text-muted-foreground mt-1">{layer.scale.toFixed(1)}x</div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2">Rotation</Label>
          <Slider
            value={[layer.rotate]}
            min={0}
            max={360}
            step={1}
            onValueChange={(value) => onUpdate({ rotate: value[0] ?? 0 })}
          />
          <div className="text-right text-xs text-muted-foreground mt-1">{layer.rotate}°</div>
        </div>
        
        <div className="col-span-2">
             <Label className="text-xs font-medium text-muted-foreground mb-2">Color</Label>
             <ColorPicker value={layer.color} onChange={(c) => onUpdate({ color: c })} />
        </div>

        <div className="col-span-2">
            <Label className="text-xs font-medium text-muted-foreground mb-2">Opacity</Label>
            <Slider
              value={[layer.opacity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(value) => onUpdate({ opacity: value[0] ?? 1 })}
            />
        </div>
      </div>
    </div>
  );
};

export default LayerControls;

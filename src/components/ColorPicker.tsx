'use client';

import React from 'react';
import { tailwindColors } from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-4">
            {/* Custom & Basic */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 p-2 border border-border rounded-lg bg-background">
                     <span className="text-xs text-muted-foreground font-medium">Custom</span>
                     <div className="relative w-full h-6">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                            className="w-full h-full rounded border border-border" 
                            style={{ backgroundColor: value }} 
                        />
                     </div>
                     <span className="text-xs font-mono text-muted-foreground w-16 text-right truncate">{value}</span>
                </div>
                
                <Button
                    onClick={() => onChange('#000000')}
                    variant="outline"
                    size="icon"
                    className={`w-8 h-8 rounded-full bg-black border-border ${value === '#000000' || value === 'black' ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                    title="Black"
                />
                <Button
                    onClick={() => onChange('#ffffff')}
                    variant="outline"
                    size="icon"
                    className={`w-8 h-8 rounded-full bg-white border-border ${value === '#ffffff' || value === 'white' ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                    title="White"
                />
            </div>

            {/* Tailwind Grid */}
            <ScrollArea className="h-64 pr-2 border-t border-border pt-3">
                <div className="space-y-3">
                    {Object.entries(tailwindColors).map(([colorName, shades]) => (
                        <div key={colorName}>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{colorName}</div>
                            <div className="grid grid-cols-11 gap-1">
                                {Object.entries(shades).map(([shade, colorValue]) => (
                                    <Button
                                        key={shade}
                                        variant="ghost"
                                        size="icon"
                                        className={`w-4 h-4 rounded-sm p-0 hover:scale-125 transition-transform ${value === colorValue ? 'ring-1 ring-primary z-10 scale-125' : ''}`}
                                        style={{ backgroundColor: colorValue }}
                                        onClick={() => onChange(colorValue)}
                                        title={`${colorName}-${shade}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ColorPicker;

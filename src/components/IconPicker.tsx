'use client';

import React, { useState, useMemo } from 'react';
import { icons } from '@/lib/icons';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IconPickerProps {
  onAddLayer: (iconId: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ onAddLayer }) => {
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(50);

  const filteredIcons = useMemo(() => {
    if (!search) return icons;
    const lower = search.toLowerCase();
    return icons.filter(i => 
      i.name.toLowerCase().includes(lower) || 
      i.id.includes(lower)
    );
  }, [search]);

  const displayedIcons = filteredIcons.slice(0, limit);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header / Search */}
      <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">Add Icons</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Search icons..."
            value={search}
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(50); // Reset limit on new search
            }}
            className="pl-9"
          />
        </div>
        <div className="text-xs text-muted-foreground mt-2 flex justify-between">
            <span>{filteredIcons.length} icons found</span>
        </div>
      </div>

      {/* Grid */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        onScroll={(e) => {
            const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 50;
            if (bottom && displayedIcons.length < filteredIcons.length) {
                setLimit(l => l + 50);
            }
        }}
      >
        <div className="grid grid-cols-4 gap-2 pb-4">
            {displayedIcons.map(icon => {
              const IconComp = icon.component;
              return (
                <Button
                  key={icon.id}
                  onClick={() => onAddLayer(icon.id)}
                  variant="outline"
                  size="icon"
                  className="aspect-square rounded-md border-border hover:shadow-sm group relative"
                  title={icon.name}
                >
                  <IconComp size={24} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-transform" />
                </Button>
              );
            })}
        </div>
        
        {displayedIcons.length < filteredIcons.length && (
             <div className="text-center py-4">
                 <Button 
                    onClick={() => setLimit(l => l + 50)} 
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                >
                    Load More
                 </Button>
             </div>
        )}

        {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
                No icons found.
            </div>
        )}
      </div>
    </div>
  );
};

export default IconPicker;

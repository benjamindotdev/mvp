'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Canvas from '@/components/Canvas';
import LayerControls from '@/components/LayerControls';
import IconPicker from '@/components/IconPicker';
import ExportButton from '@/components/ExportButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProjectManager } from '@/components/ProjectManager';
import { Button } from '@/components/ui/button';
import { Layer } from '@/types/layer';
import { FilePlus2, Github } from 'lucide-react';
import { 
  Project, 
  saveProject, 
  migrateLegacyProject, 
  getLastProjectId, 
  getProjects 
} from '@/lib/storage';

export default function Home() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentProject, setCurrentProject] = useState<{ id: string, name: string }>({ 
      id: crypto.randomUUID(), 
      name: 'Untitled Project' 
  });

  const createInitialLayer = (): Layer => ({
    id: crypto.randomUUID(),
    iconId: 'square',
    x: 256,
    y: 256,
    scale: 10,
    rotate: 0,
    opacity: 1,
    color: '#000000',
    zIndex: 0
  });

  // Load from local storage
  useEffect(() => {
    // Wrap in setTimeout to avoid "setState synchronously within an effect" warning
    const timer = setTimeout(() => {
      // 1. Try migrating legacy
      migrateLegacyProject();

      // 2. Check for last project
      const lastId = getLastProjectId();
      const allProjects = getProjects();
      
      let loaded = false;
      if (lastId) {
          const found = allProjects.find(p => p.id === lastId);
          if (found) {
              setLayers(found.layers);
              setCurrentProject({ id: found.id, name: found.name });
              if (found.layers.length > 0) setSelectedLayerId(found.layers[found.layers.length - 1].id);
              loaded = true;
          }
      } 
      
      // 3. Fallback to first project or new
      if (!loaded) {
          if (allProjects.length > 0) {
              const first = allProjects[0];
              setLayers(first.layers);
              setCurrentProject({ id: first.id, name: first.name });
              if (first.layers.length > 0) setSelectedLayerId(first.layers[first.layers.length - 1].id);
          } else {
              const initialLayer = createInitialLayer();
              setLayers([initialLayer]);
              setSelectedLayerId(initialLayer.id);
              // We don't save yet, wait for change
          }
      }
      setHasLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to local storage (Auto-save)
  useEffect(() => {
      if (hasLoaded) {
          saveProject({
              id: currentProject.id,
              name: currentProject.name,
              updatedAt: Date.now(),
              layers
          });
      }
  }, [layers, hasLoaded, currentProject]);

  const handleLoadProject = (project: Project) => {
      setLayers(project.layers);
      setCurrentProject({ id: project.id, name: project.name });
      if (project.layers.length > 0) setSelectedLayerId(project.layers[project.layers.length - 1].id);
  };

  const handleRenameProject = (name: string) => {
      setCurrentProject(prev => ({ ...prev, name }));
  };

  const handleNewSvg = () => {
    const initialLayer = createInitialLayer();
    const newId = crypto.randomUUID();
    setLayers([initialLayer]);
    setSelectedLayerId(initialLayer.id);
    setCurrentProject({ id: newId, name: 'Untitled Project' });
  };

  const addLayer = (iconId: string) => {
    const newLayer: Layer = {
      id: crypto.randomUUID(),
      iconId,
      x: 256,
      y: 256,
      scale: 4,
      rotate: 0,
      opacity: 1,
      color: '#000000',
      zIndex: layers.length > 0 ? Math.max(...layers.map(l => l.zIndex)) + 1 : 0
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (changes: Partial<Layer>) => {
      if (!selectedLayerId) return;
      setLayers(layers.map(l => l.id === selectedLayerId ? { ...l, ...changes } : l));
  };

  const deleteLayer = () => {
       if (!selectedLayerId) return;
       const newLayers = layers.filter(l => l.id !== selectedLayerId);
       setLayers(newLayers);
       setSelectedLayerId(null);
  };
  
  const duplicateLayer = () => {
      const selected = layers.find(l => l.id === selectedLayerId);
      if(!selected) return;
      const newLayer = { 
          ...selected, 
          id: crypto.randomUUID(), 
          x: selected.x + 20, 
          y: selected.y + 20,
          zIndex: Math.max(...layers.map(l => l.zIndex)) + 1
        };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
  };

  const moveLayer = (direction: 'up' | 'down') => {
      if(!selectedLayerId) return;
      const sorted = [...layers].sort((a,b) => a.zIndex - b.zIndex);
      const index = sorted.findIndex(l => l.id === selectedLayerId);
      if (index === -1) return;
      
      if (direction === 'up' && index < sorted.length - 1) {
          // Swap z-index with next
          const current = sorted[index];
          const next = sorted[index + 1];
          const tempZ = current.zIndex;
          current.zIndex = next.zIndex;
          next.zIndex = tempZ;
          setLayers([...sorted]);
      } else if (direction === 'down' && index > 0) {
           // Swap zindex with prev
          const current = sorted[index];
          const prev = sorted[index - 1];
          const tempZ = current.zIndex;
          current.zIndex = prev.zIndex;
          prev.zIndex = tempZ;
          setLayers([...sorted]);
      }
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  if (!hasLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <header className="flex justify-between items-center px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg tracking-tight flex flex-col leading-none">
              <span>M<span className="opacity-50 font-sans">odular</span></span>
              <span>V<span className="opacity-50 font-sans">ector</span></span>
              <span>P<span className="opacity-50 font-sans">layground</span></span>
            </h1>
        </div>
        <div className="flex gap-2 items-center">
             <ProjectManager 
                currentProjectId={currentProject.id}
                currentProjectName={currentProject.name}
                onLoadProject={handleLoadProject}
                onRenameProject={handleRenameProject}
                onNewProject={handleNewSvg}
             />
             <ThemeToggle />
             <Button variant="outline" size="sm" onClick={handleNewSvg} className="gap-2">
               <FilePlus2 size={16} />
               New SVG
             </Button>
             <ExportButton layers={layers} onAfterExport={handleNewSvg} />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Icon Picker */}
        <aside className="w-64 border-r border-border bg-muted/40 flex flex-col">
          <IconPicker onAddLayer={addLayer} />
        </aside>

        {/* Center - Canvas */}
        <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 overflow-auto">
          <Canvas 
            layers={layers} 
            selectedLayerId={selectedLayerId} 
            onSelectLayer={setSelectedLayerId} 
          />
        </div>

        {/* Right Sidebar - Controls */}
        <aside className="w-72 border-l border-border bg-background flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Layer Properties</h2>
            <p className="text-xs text-muted-foreground mt-1">Select a layer to edit transforms.</p>
          </div>
          
          {selectedLayer ? (
              <LayerControls 
                layer={selectedLayer} 
                onUpdate={updateLayer} 
                onDelete={deleteLayer}
                onDuplicate={duplicateLayer}
                onMoveUp={() => moveLayer('up')}
                onMoveDown={() => moveLayer('down')}
              />
          ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                  Select a layer on the canvas to edit properties.
              </div>
          )}
          
            <div className="mt-auto p-4 border-t border-border bg-muted/30">
             <div className="space-y-2">
               <h3 className="text-xs font-semibold text-muted-foreground uppercase">Layers</h3>
               <div className="space-y-1 max-h-48 overflow-y-auto">
                     {[...layers].sort((a,b) => b.zIndex - a.zIndex).map(l => (
                         <div 
                            key={l.id} 
                            onClick={() => setSelectedLayerId(l.id)}
                    className={`p-2 rounded text-xs flex items-center gap-2 cursor-pointer ${l.id === selectedLayerId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                         >
                    <span className="w-3 h-3 rounded-full border border-border" style={{backgroundColor: l.color}}></span>
                            {l.iconId}
                         </div>
                     ))}
                 </div>
             </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-border p-4 bg-background">
        <div className="flex flex-row justify-center items-center gap-2 md:gap-6 text-center text-muted-foreground">
            <p className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                <span className="md:hidden">©</span>
                <span className="hidden md:inline">Copyright © {new Date().getFullYear()} Modular Vector Playground</span>
            </p>
            <span className="hidden md:inline opacity-80">|</span>
            <p className="hidden md:block text-sm opacity-80 hover:opacity-100 transition-opacity">
                All rights reserved
            </p>
            <span className="hidden md:inline opacity-80">|</span>
            <div className="flex flex-row gap-2 items-center">
                <span className="hidden md:inline text-sm opacity-80 hover:opacity-100 transition-opacity">Built by</span>
                <a
                    href="https://benjamin.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-100 flex items-center gap-2"
                    aria-label="Built by benjamin.dev"
                >
                    <Image
                        src="/benjamin.webp"
                        alt="benjamin.dev"
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full object-cover"
                    />
                </a>
            </div>
            <span className="hidden md:inline opacity-80">|</span>
            <a href="https://github.com/benjamindotdev/mvp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground opacity-80 hover:opacity-100 transition-opacity">
                <Github size={20} />
            </a>
        </div>
      </footer>
    </div>
  );
}

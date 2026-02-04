'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Trash2, 
  Clock, 
  Check 
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Project, getProjects, deleteProject } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface ProjectManagerProps {
  currentProjectId: string | null;
  onLoadProject: (project: Project) => void;
  currentProjectName: string;
  onRenameProject: (name: string) => void;
  onNewProject: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ 
  currentProjectId, 
  onLoadProject, 
  currentProjectName, 
  onRenameProject,
  onNewProject
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProjectName);

  useEffect(() => {
    if (isOpen) {
      setProjects(getProjects().sort((a, b) => b.updatedAt - a.updatedAt));
    }
  }, [isOpen]);

  useEffect(() => {
    setTempName(currentProjectName);
  }, [currentProjectName]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
        deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        if (id === currentProjectId) {
            onNewProject(); // Reset if deleted current
        }
    }
  };

  const handleNameSubmit = () => {
      onRenameProject(tempName);
      setEditingName(false);
  };

  return (
    <div className="flex items-center gap-2">
         {/* Inline Name Editor */}
         {editingName ? (
            <div className="flex items-center gap-1">
                <Input 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-8 w-32 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSubmit();
                        if (e.key === 'Escape') {
                            setTempName(currentProjectName);
                            setEditingName(false);
                        };
                    }}
                    onBlur={() => {
                         // Optional: save on blur or cancel? Let's save.
                         handleNameSubmit();
                    }}
                />
            </div>
         ) : (
            <div 
                className="text-sm font-medium hover:bg-muted px-2 py-1 rounded cursor-pointer transition-colors max-w-[150px] truncate"
                onClick={() => setEditingName(true)}
                title="Click to rename"
            >
                {currentProjectName || 'Untitled Project'}
            </div>
         )}


        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen size={16} />
            Projects
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Saved Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-64">
                {projects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                        No saved projects
                    </div>
                ) : (
                    projects.map(project => (
                        <DropdownMenuItem 
                            key={project.id}
                            className="flex items-center justify-between cursor-pointer group"
                            onClick={() => onLoadProject(project)}
                        >
                            <div className="flex flex-col overflow-hidden">
                                <span className={`truncate font-medium ${project.id === currentProjectId ? 'text-primary' : ''}`}>
                                    {project.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(project.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {project.id === currentProjectId && (
                                <Check size={14} className="text-primary mr-2" />
                            )}
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(e, project.id)}>
                                <div className="p-1 hover:bg-destructive/10 hover:text-destructive rounded">
                                    <Trash2 size={14} />
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </ScrollArea>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};

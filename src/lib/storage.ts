import { Layer } from '@/types/layer';

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  layers: Layer[];
}

const PROJECTS_KEY = 'mvp-projects';
const LEGACY_KEY = 'mvp-layers';
const LAST_PROJECT_KEY = 'mvp-last-project-id';

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse projects', e);
    return [];
  }
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = { ...project, updatedAt: Date.now() };
  } else {
    projects.push({ ...project, updatedAt: Date.now() });
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  localStorage.setItem(LAST_PROJECT_KEY, project.id);
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
};

export const migrateLegacyProject = (): Project | null => {
  if (typeof window === 'undefined') return null;
  
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    try {
      const layers = JSON.parse(legacy);
      if (Array.isArray(layers) && layers.length > 0) {
        const project: Project = {
          id: crypto.randomUUID(),
          name: 'Restored Project',
          updatedAt: Date.now(),
          layers
        };
        saveProject(project);
        localStorage.removeItem(LEGACY_KEY);
        return project;
      }
    } catch (e) {
      console.error('Failed to migrate legacy project', e);
    }
  }
  return null;
};

export const getLastProjectId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LAST_PROJECT_KEY);
}

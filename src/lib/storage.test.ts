import { getProjects, saveProject, deleteProject, Project } from './storage';

const mockProject: Project = {
  id: 'test-1',
  name: 'Test Project',
  updatedAt: 1234567890,
  layers: [],
};

describe('Storage Helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('getProjects returns empty array when no projects exist', () => {
    const projects = getProjects();
    expect(projects).toEqual([]);
  });

  test('saveProject saves a new project', () => {
    saveProject(mockProject);
    const projects = getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]).toEqual(expect.objectContaining({
      id: mockProject.id,
      name: mockProject.name,
    }));
  });

  test('saveProject updates an existing project', () => {
    saveProject(mockProject);
    const updatedProject = { ...mockProject, name: 'Updated Name' };
    saveProject(updatedProject);
    
    const projects = getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Updated Name');
    // updatedAt should be updated, so it won't be equal to original mockProject.updatedAt
    expect(projects[0].updatedAt).not.toBe(mockProject.updatedAt);
  });

  test('deleteProject removes a project', () => {
    saveProject(mockProject);
    deleteProject(mockProject.id);
    const projects = getProjects();
    expect(projects).toEqual([]);
  });


  test('deleteProject does nothing if project id not found', () => {
    saveProject(mockProject);
    deleteProject('non-existent-id');
    const projects = getProjects();
    expect(projects).toHaveLength(1);
  });

  test('getLastProjectId returns stored id', () => {
    saveProject(mockProject);
    // saveProject saves id to LAST_PROJECT_KEY
    const { getLastProjectId } = require('./storage');
    // We need to re-require or just import it. It was imported.
    const lastId = getLastProjectId();
    expect(lastId).toBe(mockProject.id);
  });

  test('migrateLegacyProject migrates data', () => {
    const legacyLayers = [{ type: 'circle', id: '1' }];
    localStorage.setItem('mvp-layers', JSON.stringify(legacyLayers));
    
    // We need to import it.
    const { migrateLegacyProject } = require('./storage');
    const project = migrateLegacyProject();
    
    expect(project).toBeDefined();
    expect(project.layers).toEqual(legacyLayers);
    expect(project.name).toBe('Restored Project');
    
    // Should remove legacy key
    expect(localStorage.getItem('mvp-layers')).toBeNull();
    
    // Should be saved in projects
    const projects = getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe(project.id);
  });

  test('migrateLegacyProject returns null if no legacy data', () => {
     const { migrateLegacyProject } = require('./storage');
     const project = migrateLegacyProject();
     expect(project).toBeNull();
  });
  
  test('getProjects handles JSON parse error', () => {
      localStorage.setItem('mvp-projects', 'invalid-json');
      const projects = getProjects();
      expect(projects).toEqual([]);
      // Should log error but we can just check return value
  });
});


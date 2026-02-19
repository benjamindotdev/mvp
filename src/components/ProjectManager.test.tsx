import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectManager } from './ProjectManager';
import { getProjects, deleteProject } from '@/lib/storage';

// Verify the mocks are working by explicitly casting them to jest.Mock
jest.mock('@/lib/storage');

const mockGetProjects = getProjects as jest.Mock;
const mockDeleteProject = deleteProject as jest.Mock;

describe('ProjectManager Component', () => {
  const mockOnLoadProject = jest.fn();
  const mockOnRenameProject = jest.fn();
  const mockOnNewProject = jest.fn();
  const currentProjectId = 'p1';
  const currentProjectName = 'My Project';

  const mockProjects = [
    { id: 'p1', name: 'My Project', updatedAt: 1000, layers: [] },
    { id: 'p2', name: 'Other Project', updatedAt: 2000, layers: [] }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProjects.mockReturnValue(mockProjects);
    // Mock window.confirm
    global.confirm = jest.fn(() => true); 
  });

  // Mock RequestAnimationFrame for Radix UI
  beforeAll(() => {
    global.Element.prototype.hasPointerCapture = () => false;
    global.Element.prototype.setPointerCapture = () => {};
    global.Element.prototype.releasePointerCapture = () => {};
  });

  test('renders current project name', () => {
    render(
      <ProjectManager
        currentProjectId={currentProjectId}
        onLoadProject={mockOnLoadProject}
        currentProjectName={currentProjectName}
        onRenameProject={mockOnRenameProject}
        onNewProject={mockOnNewProject}
      />
    );
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  test('clicking on project name allows editing', async () => {
     const user = userEvent.setup();
     render(
      <ProjectManager
        currentProjectId={currentProjectId}
        onLoadProject={mockOnLoadProject}
        currentProjectName={currentProjectName}
        onRenameProject={mockOnRenameProject}
        onNewProject={mockOnNewProject}
      />
    );
    
    // Find the div with the project name
    const nameDisplay = screen.getByText(currentProjectName);
    await user.click(nameDisplay);

    // Should switch to input
    const input = screen.getByDisplayValue(currentProjectName);
    expect(input).toBeInTheDocument();
    
    // Change value
    await user.clear(input);
    await user.type(input, 'New Name');
    
    // Submit (Enter key)
    await user.keyboard('{Enter}');
    
    // Since handleNameSubmit calls onRenameProject directly
    expect(mockOnRenameProject).toHaveBeenCalledWith('New Name');
  });

  test('opening dropdown loads projects', async () => {
    const user = userEvent.setup();
    mockGetProjects.mockReturnValue(mockProjects);
    render(
      <ProjectManager
        currentProjectId={currentProjectId}
        onLoadProject={mockOnLoadProject}
        currentProjectName={currentProjectName}
        onRenameProject={mockOnRenameProject}
        onNewProject={mockOnNewProject}
      />
    );
    
    // The dropdown trigger contains "Projects" text
    const trigger = screen.getByText('Projects');
    
    // Open dropdown
    await user.click(trigger);
    
    // Check if getProjects was called
    await waitFor(() => {
        expect(mockGetProjects).toHaveBeenCalled();
    });
    
    
    // Check if items are rendered
    // "Other Project" should be visible
    expect(await screen.findByText('Other Project')).toBeInTheDocument();
  });
});

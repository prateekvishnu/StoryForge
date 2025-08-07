'use client';

import { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';

import { StoryTemplate, StoryProject } from '@/types/story';
import StoryTemplates from '@/components/story/StoryTemplates';
import StoryFlowEditor from '@/components/story/StoryFlowEditor';

export default function StoryPlannerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [currentProject, setCurrentProject] = useState<StoryProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTemplateSelect = (template: StoryTemplate) => {
    const newProject: StoryProject = {
      id: `project-${Date.now()}`,
      name: `${template.name} - My Story`,
      description: `Based on ${template.name} template`,
      templateId: template.id,
      ageGroup: template.ageGroup,
      category: template.category,
      nodes: template.nodes,
      connections: template.connections,
      currentProgress: {
        completedNodes: [],
        totalNodes: template.nodes.length,
        percentComplete: 0,
      },
      settings: {
        allowBranching: true,
        maxDecisionPoints: template.decisionPoints + 5,
        targetWordCount: template.nodes.reduce((acc, node) => acc + node.metadata.wordCount, 0),
        includeImages: true,
        includeAudio: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastEditedBy: 'user',
        version: 1,
        published: false,
      },
    };

    setSelectedTemplate(template);
    setCurrentProject(newProject);
    setIsEditing(true);
  };

  const handleCreateFromScratch = () => {
    const emptyProject: StoryProject = {
      id: `project-${Date.now()}`,
      name: 'My New Story',
      description: 'A story created from scratch',
      ageGroup: '7-10',
      category: 'adventure',
      nodes: [],
      connections: [],
      currentProgress: {
        completedNodes: [],
        totalNodes: 0,
        percentComplete: 0,
      },
      settings: {
        allowBranching: true,
        maxDecisionPoints: 10,
        targetWordCount: 500,
        includeImages: true,
        includeAudio: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastEditedBy: 'user',
        version: 1,
        published: false,
      },
    };

    setCurrentProject(emptyProject);
    setIsEditing(true);
  };

  const handleProjectSave = (project: StoryProject) => {
    setCurrentProject(project);
    // Here you would typically save to a database or local storage
    console.log('Saving project:', project);
  };

  const handleProjectPreview = (project: StoryProject) => {
    // Handle preview functionality
    console.log('Previewing project:', project);
  };

  const handleBackToTemplates = () => {
    setIsEditing(false);
    setCurrentProject(null);
    setSelectedTemplate(null);
  };

  if (isEditing && currentProject) {
    return (
      <StoryFlowEditor
        project={currentProject}
        onSave={handleProjectSave}
        onPreview={handleProjectPreview}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          📖 Visual Story Planner
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create interactive stories with our visual flowchart editor
        </Typography>
      </Box>

      <StoryTemplates
        onTemplateSelect={handleTemplateSelect}
        onCreateFromScratch={handleCreateFromScratch}
      />
    </Container>
  );
} 
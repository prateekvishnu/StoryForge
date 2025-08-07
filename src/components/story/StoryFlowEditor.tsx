'use client';

import { useCallback, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as StartIcon,
  AutoStories as StoryIcon,
  QuestionMark as DecisionIcon,
  Flag as EndIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { StoryNode, StoryConnection, StoryProject, NODE_TYPES } from '@/types/story';
import StoryNodeComponent from './StoryNodeComponent';
import StoryPreview from './StoryPreview';

interface StoryFlowEditorProps {
  project?: StoryProject;
  onSave?: (project: StoryProject) => void;
  onPreview?: (project: StoryProject) => void;
  readOnly?: boolean;
}

// Custom node types for React Flow
const nodeTypes: NodeTypes = {
  storyNode: StoryNodeComponent,
};

// Custom edge styles
const edgeTypes: EdgeTypes = {};

const defaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#3b82f6',
  },
  style: {
    strokeWidth: 2,
    stroke: '#3b82f6',
  },
};

export default function StoryFlowEditor({ 
  project, 
  onSave, 
  onPreview, 
  readOnly = false 
}: StoryFlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<StoryNode | null>(null);

  // Initialize nodes and edges from project
  const initializeFromProject = useCallback((projectData: StoryProject) => {
    const flowNodes: Node[] = projectData.nodes.map((node) => ({
      id: node.id,
      type: 'storyNode',
      position: node.position,
      data: {
        ...node,
        onEdit: (nodeData: StoryNode) => {
          setEditingNode(nodeData);
          setNodeDialogOpen(true);
        },
        onDelete: (nodeId: string) => {
          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
          setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        },
      },
      draggable: !readOnly,
    }));

    const flowEdges: Edge[] = projectData.connections.map((conn) => ({
      id: conn.id,
      source: conn.fromNodeId,
      target: conn.toNodeId,
      label: conn.label,
      ...defaultEdgeOptions,
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges, readOnly]);

  // Initialize from project if provided
  useMemo(() => {
    if (project) {
      initializeFromProject(project);
    }
  }, [project, initializeFromProject]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, readOnly]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNewNode = useCallback((nodeType: 'start' | 'story' | 'decision' | 'ending') => {
    if (readOnly) return;

    const newNode: StoryNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      title: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
      content: 'Click to edit this node content...',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      connections: [],
      mediaPlaceholders: { images: [] },
      metadata: {
        wordCount: 0,
        estimatedReadingTime: 0,
        ageAppropriate: true,
      },
    };

    const flowNode: Node = {
      id: newNode.id,
      type: 'storyNode',
      position: newNode.position,
      data: {
        ...newNode,
        onEdit: (nodeData: StoryNode) => {
          setEditingNode(nodeData);
          setNodeDialogOpen(true);
        },
        onDelete: (nodeId: string) => {
          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
          setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        },
      },
      draggable: true,
    };

    setNodes((nds) => [...nds, flowNode]);
  }, [setNodes, setEdges, readOnly]);

  const saveNodeEdit = useCallback((nodeData: StoryNode) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeData.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...nodeData,
              },
            }
          : node
      )
    );
    setNodeDialogOpen(false);
    setEditingNode(null);
  }, [setNodes]);

  const handleSave = useCallback(() => {
    if (!onSave) return;

    const storyNodes: StoryNode[] = nodes.map((node) => ({
      ...node.data,
      position: node.position,
    }));

    const storyConnections: StoryConnection[] = edges.map((edge) => ({
      id: edge.id,
      fromNodeId: edge.source,
      toNodeId: edge.target,
      label: edge.label,
    }));

    const updatedProject: StoryProject = {
      id: project?.id || `project-${Date.now()}`,
      name: project?.name || 'Untitled Story',
      description: project?.description || '',
      ageGroup: project?.ageGroup || '7-10',
      category: project?.category || 'adventure',
      nodes: storyNodes,
      connections: storyConnections,
      currentProgress: {
        completedNodes: [],
        totalNodes: storyNodes.length,
        percentComplete: 0,
      },
      settings: project?.settings || {
        allowBranching: true,
        maxDecisionPoints: 10,
        targetWordCount: 500,
        includeImages: true,
        includeAudio: false,
      },
      metadata: {
        createdAt: project?.metadata.createdAt || new Date(),
        updatedAt: new Date(),
        lastEditedBy: 'user',
        version: (project?.metadata.version || 0) + 1,
        published: false,
      },
    };

    onSave(updatedProject);
  }, [nodes, edges, project, onSave]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      const storyNodes: StoryNode[] = nodes.map((node) => ({
        ...node.data,
        position: node.position,
      }));

      const storyConnections: StoryConnection[] = edges.map((edge) => ({
        id: edge.id,
        fromNodeId: edge.source,
        toNodeId: edge.target,
        label: edge.label,
      }));

      const previewProject: StoryProject = {
        id: project?.id || 'preview',
        name: project?.name || 'Story Preview',
        description: project?.description || '',
        ageGroup: project?.ageGroup || '7-10',
        category: project?.category || 'adventure',
        nodes: storyNodes,
        connections: storyConnections,
        currentProgress: {
          completedNodes: [],
          totalNodes: storyNodes.length,
          percentComplete: 0,
        },
        settings: project?.settings || {
          allowBranching: true,
          maxDecisionPoints: 10,
          targetWordCount: 500,
          includeImages: true,
          includeAudio: false,
        },
        metadata: {
          createdAt: project?.metadata.createdAt || new Date(),
          updatedAt: new Date(),
          lastEditedBy: 'user',
          version: project?.metadata.version || 1,
          published: false,
        },
      };

      onPreview(previewProject);
    } else {
      setPreviewOpen(true);
    }
  }, [nodes, edges, project, onPreview]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Paper sx={{ borderRadius: 0, zIndex: 1000 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📖 Story Flow Editor
          </Typography>

          {!readOnly && (
            <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
              <Tooltip title="Add Start Node">
                <IconButton
                  onClick={() => addNewNode('start')}
                  color="success"
                  size="small"
                >
                  <StartIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Story Node">
                <IconButton
                  onClick={() => addNewNode('story')}
                  color="primary"
                  size="small"
                >
                  <StoryIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Decision Node">
                <IconButton
                  onClick={() => addNewNode('decision')}
                  color="warning"
                  size="small"
                >
                  <DecisionIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Ending Node">
                <IconButton
                  onClick={() => addNewNode('ending')}
                  color="error"
                  size="small"
                >
                  <EndIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              variant="outlined"
              size="small"
            >
              Preview
            </Button>

            {!readOnly && onSave && (
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
                variant="contained"
                size="small"
              >
                Save
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Paper>

      {/* React Flow Canvas */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="top-right"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </Box>

      {/* Node Stats */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {nodes.filter(n => n.data.type === 'start').length}
            </Typography>
            <Typography variant="caption">Start</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              {nodes.filter(n => n.data.type === 'story').length}
            </Typography>
            <Typography variant="caption">Story</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {nodes.filter(n => n.data.type === 'decision').length}
            </Typography>
            <Typography variant="caption">Decisions</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error.main">
              {nodes.filter(n => n.data.type === 'ending').length}
            </Typography>
            <Typography variant="caption">Endings</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.primary">
              {edges.length}
            </Typography>
            <Typography variant="caption">Connections</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Node Edit Dialog */}
      <Dialog
        open={nodeDialogOpen}
        onClose={() => setNodeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit {editingNode?.type?.charAt(0).toUpperCase()}{editingNode?.type?.slice(1)} Node
        </DialogTitle>
        <DialogContent>
          {editingNode && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                value={editingNode.title}
                onChange={(e) =>
                  setEditingNode({ ...editingNode, title: e.target.value })
                }
                fullWidth
              />

              <TextField
                label="Content"
                value={editingNode.content}
                onChange={(e) =>
                  setEditingNode({ ...editingNode, content: e.target.value })
                }
                multiline
                rows={4}
                fullWidth
              />

              {editingNode.type === 'decision' && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Decision Choices:
                  </Typography>
                  {/* Decision choices would be managed here */}
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Add Choice
                  </Button>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Media Placeholders:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Add Image"
                    icon={<AddIcon />}
                    onClick={() => {
                      const newImages = [...editingNode.mediaPlaceholders.images, `image-${Date.now()}.jpg`];
                      setEditingNode({
                        ...editingNode,
                        mediaPlaceholders: {
                          ...editingNode.mediaPlaceholders,
                          images: newImages,
                        },
                      });
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNodeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => editingNode && saveNodeEdit(editingNode)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Story Preview</DialogTitle>
        <DialogContent>
          <StoryPreview
            nodes={nodes.map(n => n.data)}
            connections={edges.map(e => ({
              id: e.id,
              fromNodeId: e.source,
              toNodeId: e.target,
              label: e.label,
            }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
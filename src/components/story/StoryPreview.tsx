'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  AutoStories as StoryIcon,
  QuestionMark as DecisionIcon,
  Flag as EndIcon,
} from '@mui/icons-material';

import { StoryNode, StoryConnection } from '@/types/story';

interface StoryPreviewProps {
  nodes: StoryNode[];
  connections: StoryConnection[];
}

export default function StoryPreview({ nodes, connections }: StoryPreviewProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);

  // Find the start node
  const startNode = nodes.find(node => node.type === 'start');
  const currentNode = currentNodeId ? nodes.find(node => node.id === currentNodeId) : startNode;

  // Get connected nodes from current node
  const getConnectedNodes = (nodeId: string): StoryNode[] => {
    const nodeConnections = connections.filter(conn => conn.fromNodeId === nodeId);
    return nodeConnections.map(conn => nodes.find(node => node.id === conn.toNodeId)!).filter(Boolean);
  };

  const handleNodeNavigation = (nodeId: string) => {
    setCurrentNodeId(nodeId);
    if (!visitedNodes.includes(nodeId)) {
      setVisitedNodes([...visitedNodes, nodeId]);
    }
  };

  const resetPreview = () => {
    setCurrentNodeId(null);
    setVisitedNodes([]);
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'start': return <StartIcon />;
      case 'story': return <StoryIcon />;
      case 'decision': return <DecisionIcon />;
      case 'ending': return <EndIcon />;
      default: return <StoryIcon />;
    }
  };

  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'start': return 'success';
      case 'story': return 'primary';
      case 'decision': return 'warning';
      case 'ending': return 'error';
      default: return 'default';
    }
  };

  if (!startNode) {
    return (
      <Alert severity="warning">
        No start node found. Please add a start node to preview the story.
      </Alert>
    );
  }

  if (!currentNode) {
    return (
      <Alert severity="error">
        Current node not found. Please check your story structure.
      </Alert>
    );
  }

  const connectedNodes = getConnectedNodes(currentNode.id);
  const progress = (visitedNodes.length / nodes.length) * 100;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Story Progress</Typography>
          <Button variant="outlined" size="small" onClick={resetPreview}>
            Start Over
          </Button>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary">
          {visitedNodes.length} of {nodes.length} nodes visited ({Math.round(progress)}%)
        </Typography>
      </Box>

      {/* Current Node Display */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              icon={getNodeIcon(currentNode.type)}
              label={currentNode.type.charAt(0).toUpperCase() + currentNode.type.slice(1)}
              color={getNodeColor(currentNode.type) as any}
              sx={{ mr: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {currentNode.title}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              fontSize: '1.1rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            {currentNode.content}
          </Typography>

          {/* Media Placeholders */}
          {(currentNode.mediaPlaceholders.images.length > 0 || currentNode.mediaPlaceholders.audio) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Media Content:
              </Typography>
              <Stack direction="row" spacing={1}>
                {currentNode.mediaPlaceholders.images.map((image, index) => (
                  <Chip
                    key={index}
                    label={`📷 ${image}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {currentNode.mediaPlaceholders.audio && (
                  <Chip
                    label={`🔊 ${currentNode.mediaPlaceholders.audio}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Node Metadata */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              📝 {currentNode.metadata.wordCount} words
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ⏱️ ~{currentNode.metadata.estimatedReadingTime} min read
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Options */}
      {connectedNodes.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentNode.type === 'decision' ? '🎮 What do you choose?' : '➡️ Continue the story:'}
            </Typography>

            <Stack spacing={2}>
              {connectedNodes.map((node, index) => {
                const connection = connections.find(
                  conn => conn.fromNodeId === currentNode.id && conn.toNodeId === node.id
                );
                
                return (
                  <Button
                    key={node.id}
                    variant="outlined"
                    onClick={() => handleNodeNavigation(node.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      p: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ mr: 2 }}>
                        {getNodeIcon(node.type)}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {connection?.label || node.title}
                        </Typography>
                        {node.content && (
                          <Typography variant="body2" color="text.secondary">
                            {node.content.length > 100 
                              ? `${node.content.substring(0, 100)}...` 
                              : node.content
                            }
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        size="small"
                        label={node.type}
                        color={getNodeColor(node.type) as any}
                        variant="outlined"
                      />
                    </Box>
                  </Button>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* End of Story Message */}
      {connectedNodes.length === 0 && currentNode.type === 'ending' && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🎉 The End!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You've reached the end of this story path. Great job following the adventure!
            </Typography>
            <Button
              variant="contained"
              onClick={resetPreview}
              size="large"
            >
              Read Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Story Statistics */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Story Statistics
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {nodes.filter(n => n.type === 'start').length}
            </Typography>
            <Typography variant="caption">Start Points</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              {nodes.filter(n => n.type === 'story').length}
            </Typography>
            <Typography variant="caption">Story Nodes</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {nodes.filter(n => n.type === 'decision').length}
            </Typography>
            <Typography variant="caption">Decisions</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error.main">
              {nodes.filter(n => n.type === 'ending').length}
            </Typography>
            <Typography variant="caption">Endings</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.primary">
              {connections.length}
            </Typography>
            <Typography variant="caption">Connections</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
} 
'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  AutoStories as StoryIcon,
  QuestionMark as DecisionIcon,
  Flag as EndIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  VolumeUp as AudioIcon,
} from '@mui/icons-material';

import { StoryNode } from '@/types/story';

interface StoryNodeData extends StoryNode {
  onEdit?: (node: StoryNode) => void;
  onDelete?: (nodeId: string) => void;
}

const StoryNodeComponent = memo(({ data, selected }: NodeProps<StoryNodeData>) => {
  const { type, title, content, mediaPlaceholders, metadata, onEdit, onDelete } = data;

  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'start': return { bg: '#e8f5e8', border: '#4caf50', icon: '#2e7d32' };
      case 'story': return { bg: '#e3f2fd', border: '#2196f3', icon: '#1565c0' };
      case 'decision': return { bg: '#fff3e0', border: '#ff9800', icon: '#ef6c00' };
      case 'ending': return { bg: '#ffebee', border: '#f44336', icon: '#c62828' };
      default: return { bg: '#f5f5f5', border: '#9e9e9e', icon: '#616161' };
    }
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

  const colors = getNodeColor(type);
  const hasImages = mediaPlaceholders.images.length > 0;
  const hasAudio = !!mediaPlaceholders.audio;

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      {/* Input Handle */}
      {type !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: colors.border,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
        />
      )}

      {/* Node Content */}
      <Paper
        sx={{
          minWidth: 250,
          maxWidth: 300,
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? colors.icon : colors.border}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: selected ? 4 : 2,
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        {/* Node Header */}
        <Box
          sx={{
            backgroundColor: colors.border,
            color: 'white',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: 'white' }}>
              {getNodeIcon(type)}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {type}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(data)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(data.id)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Node Body */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.4,
              minHeight: '2.8em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {truncateText(content, 80)}
          </Typography>

          {/* Decision Choices Preview */}
          {type === 'decision' && 'choices' in data && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Choices:
              </Typography>
              <Stack spacing={0.5}>
                {(data as any).choices?.slice(0, 2).map((choice: any, index: number) => (
                  <Chip
                    key={choice.id}
                    label={truncateText(choice.text, 30)}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
                {(data as any).choices?.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{(data as any).choices.length - 2} more choices
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Media Indicators */}
          {(hasImages || hasAudio) && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1}>
                {hasImages && (
                  <Chip
                    icon={<ImageIcon />}
                    label={`${mediaPlaceholders.images.length} image${mediaPlaceholders.images.length !== 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                )}
                {hasAudio && (
                  <Chip
                    icon={<AudioIcon />}
                    label="Audio"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Node Metadata */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {metadata.wordCount} words
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ~{metadata.estimatedReadingTime}min
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Output Handles */}
      {type !== 'ending' && (
        <>
          {type === 'decision' ? (
            // Multiple handles for decision nodes
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="choice-1"
                style={{
                  background: colors.border,
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                  left: '25%',
                }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="choice-2"
                style={{
                  background: colors.border,
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                  left: '50%',
                }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="choice-3"
                style={{
                  background: colors.border,
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                  left: '75%',
                }}
              />
            </>
          ) : (
            // Single handle for other node types
            <Handle
              type="source"
              position={Position.Bottom}
              style={{
                background: colors.border,
                width: 12,
                height: 12,
                border: '2px solid white',
              }}
            />
          )}
        </>
      )}
    </>
  );
});

StoryNodeComponent.displayName = 'StoryNodeComponent';

export default StoryNodeComponent; 
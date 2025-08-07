'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as PreviewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
  Psychology as PersonalityIcon,
  School as BackgroundIcon,
  Star as RoleIcon,
  Target as GoalsIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Character,
  SimpleCharacter,
  ComplexCharacter,
  CharacterTemplate,
  DraggableItem,
  APPEARANCE_OPTIONS,
  PERSONALITY_OPTIONS,
  ROLE_OPTIONS,
} from '@/types/character';
import CharacterPreview from './CharacterPreview';
import CharacterTemplates from './CharacterTemplates';

interface CharacterBuilderProps {
  onCharacterSave?: (character: Character) => void;
  onCharacterLoad?: (characterId: string) => void;
  initialCharacter?: Character;
  ageGroup?: '7-10' | '11-16';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`character-tabpanel-${index}`}
      aria-labelledby={`character-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Draggable item component
interface DraggableItemProps {
  item: DraggableItem;
  isOverlay?: boolean;
}

function DraggableItemComponent({ item, isOverlay = false }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appearance': return <PaletteIcon />;
      case 'personality': return <PersonalityIcon />;
      case 'background': return <BackgroundIcon />;
      case 'role': return <RoleIcon />;
      case 'goals': return <GoalsIcon />;
      default: return <PersonIcon />;
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        m: 1,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: item.color || 'primary.light',
        color: 'white',
        borderRadius: 2,
        minHeight: 56,
        boxShadow: isOverlay ? 4 : 2,
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {getIcon(item.type)}
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {item.value}
      </Typography>
      {item.icon && (
        <Typography variant="h6">{item.icon}</Typography>
      )}
    </Paper>
  );
}

// Drop zone component
interface DropZoneProps {
  title: string;
  items: DraggableItem[];
  accepts: string[];
  onItemAdd: (item: DraggableItem) => void;
  onItemRemove: (itemId: string) => void;
  icon: React.ReactNode;
  color: string;
}

function DropZone({ title, items, accepts, onItemAdd, onItemRemove, icon, color }: DropZoneProps) {
  return (
    <Card sx={{ minHeight: 200, backgroundColor: `${color}.50` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, color: `${color}.800` }}>
            {title}
          </Typography>
        </Box>
        
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <Box sx={{ minHeight: 100 }}>
            {items.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  border: '2px dashed',
                  borderColor: `${color}.300`,
                  borderRadius: 2,
                  color: `${color}.600`,
                }}
              >
                <Typography variant="body2">
                  Drag items here to customize your character
                </Typography>
              </Box>
            ) : (
              items.map(item => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DraggableItemComponent item={item} />
                  <IconButton
                    size="small"
                    onClick={() => onItemRemove(item.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export default function CharacterBuilder({
  onCharacterSave,
  onCharacterLoad,
  initialCharacter,
  ageGroup: initialAgeGroup = '9-12' as '7-10' | '11-16',
}: CharacterBuilderProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'7-10' | '11-16'>(
    initialCharacter?.ageGroup || (initialAgeGroup === '9-12' ? '7-10' : initialAgeGroup)
  );
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(initialCharacter || null);
  const [tabValue, setTabValue] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Character attributes state
  const [appearanceItems, setAppearanceItems] = useState<DraggableItem[]>([]);
  const [personalityItems, setPersonalityItems] = useState<DraggableItem[]>([]);
  const [backgroundItems, setBackgroundItems] = useState<DraggableItem[]>([]);
  const [roleItems, setRoleItems] = useState<DraggableItem[]>([]);
  const [goalsItems, setGoalsItems] = useState<DraggableItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Available items for dragging
  const availableItems = useMemo<DraggableItem[]>(() => {
    const items: DraggableItem[] = [];

    // Appearance items
    APPEARANCE_OPTIONS.hairColors.forEach(hair => {
      items.push({
        id: `hair-${hair.value}`,
        type: 'appearance',
        category: 'hairColor',
        value: `${hair.label} Hair`,
        color: hair.color,
      });
    });

    APPEARANCE_OPTIONS.eyeColors.forEach(eye => {
      items.push({
        id: `eye-${eye.value}`,
        type: 'appearance',
        category: 'eyeColor',
        value: `${eye.label} Eyes`,
        color: eye.color,
      });
    });

    APPEARANCE_OPTIONS.skinTones.forEach(skin => {
      items.push({
        id: `skin-${skin.value}`,
        type: 'appearance',
        category: 'skinTone',
        value: `${skin.label} Skin`,
        color: skin.color,
      });
    });

    // Height options
    ['Short', 'Medium', 'Tall'].forEach(height => {
      items.push({
        id: `height-${height.toLowerCase()}`,
        type: 'appearance',
        category: 'height',
        value: `${height} Height`,
        color: '#9C27B0',
      });
    });

    // Personality items
    const personalityOptions = selectedAgeGroup === '7-10' 
      ? PERSONALITY_OPTIONS.simple 
      : PERSONALITY_OPTIONS.complex;

    personalityOptions.moods.forEach(mood => {
      items.push({
        id: `mood-${mood.value}`,
        type: 'personality',
        category: 'mood',
        value: mood.label,
        icon: mood.emoji,
        color: '#4CAF50',
      });
    });

    if (selectedAgeGroup === '7-10') {
      PERSONALITY_OPTIONS.simple.activities.forEach((activity, index) => {
        items.push({
          id: `activity-${index}`,
          type: 'personality',
          category: 'favoriteActivity',
          value: activity,
          color: '#FF9800',
        });
      });
    } else {
      PERSONALITY_OPTIONS.complex.traits.forEach((trait, index) => {
        items.push({
          id: `trait-${index}`,
          type: 'personality',
          category: 'trait',
          value: trait,
          color: '#2196F3',
        });
      });
    }

    // Role items
    const roleOptions = selectedAgeGroup === '7-10' 
      ? ROLE_OPTIONS.simple 
      : ROLE_OPTIONS.complex;

    roleOptions.forEach(role => {
      items.push({
        id: `role-${role.value}`,
        type: 'role',
        category: 'role',
        value: role.label,
        color: '#F44336',
      });
    });

    return items;
  }, [selectedAgeGroup]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItem = availableItems.find(item => item.id === active.id);
    if (!activeItem) return;

    // Handle dropping items into different zones
    const overId = over.id as string;
    
    if (overId.includes('appearance') && activeItem.type === 'appearance') {
      setAppearanceItems(prev => {
        const exists = prev.find(item => item.category === activeItem.category);
        if (exists) {
          return prev.map(item => 
            item.category === activeItem.category ? activeItem : item
          );
        }
        return [...prev, activeItem];
      });
    } else if (overId.includes('personality') && activeItem.type === 'personality') {
      setPersonalityItems(prev => {
        const exists = prev.find(item => item.category === activeItem.category);
        if (exists && activeItem.category === 'mood') {
          return prev.map(item => 
            item.category === activeItem.category ? activeItem : item
          );
        }
        return [...prev, activeItem];
      });
    } else if (overId.includes('role') && activeItem.type === 'role') {
      setRoleItems([activeItem]); // Only one role allowed
    }
  }, [availableItems]);

  const handleItemRemove = useCallback((itemId: string, category: string) => {
    switch (category) {
      case 'appearance':
        setAppearanceItems(prev => prev.filter(item => item.id !== itemId));
        break;
      case 'personality':
        setPersonalityItems(prev => prev.filter(item => item.id !== itemId));
        break;
      case 'role':
        setRoleItems(prev => prev.filter(item => item.id !== itemId));
        break;
    }
  }, []);

  const handleSaveCharacter = useCallback(() => {
    if (!currentCharacter?.name) {
      alert('Please enter a character name first!');
      return;
    }

    // Build character from current state
    const character: Character = {
      ...currentCharacter,
      updatedAt: new Date(),
    };

    onCharacterSave?.(character);
  }, [currentCharacter, onCharacterSave]);

  const handleLoadTemplate = useCallback((template: CharacterTemplate) => {
    const newCharacter: Character = {
      id: `char-${Date.now()}`,
      name: template.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      ageGroup: template.ageGroup,
      attributes: template.attributes,
    } as Character;

    setCurrentCharacter(newCharacter);
    setSelectedAgeGroup(template.ageGroup);
    setTemplatesOpen(false);
  }, []);

  const activeItem = activeId ? availableItems.find(item => item.id === activeId) : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 6, 
          textAlign: 'center', 
          fontWeight: 700,
          fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
          color: 'text.primary',
        }}
      >
        <PersonIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 'inherit' }} />
        Character Builder
      </Typography>

      {/* Age Group Selection */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Choose Age Group:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant={selectedAgeGroup === '7-10' ? 'contained' : 'outlined'}
            onClick={() => setSelectedAgeGroup('7-10')}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Ages 7-10
          </Button>
          <Button
            variant={selectedAgeGroup === '11-16' ? 'contained' : 'outlined'}
            onClick={() => setSelectedAgeGroup('11-16')}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Ages 11-16
          </Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setTemplatesOpen(true)}
        >
          Use Template
        </Button>
        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          onClick={() => setPreviewOpen(true)}
          disabled={!currentCharacter}
        >
          Preview Character
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveCharacter}
          disabled={!currentCharacter?.name}
        >
          Save Character
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            setCurrentCharacter(null);
            setAppearanceItems([]);
            setPersonalityItems([]);
            setRoleItems([]);
            setGoalsItems([]);
          }}
        >
          Start Over
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={3}>
          {/* Available Items */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Available Items
                </Typography>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Appearance" />
                  <Tab label="Personality" />
                  <Tab label="Role" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {availableItems
                      .filter(item => item.type === 'appearance')
                      .map(item => (
                        <DraggableItemComponent key={item.id} item={item} />
                      ))}
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {availableItems
                      .filter(item => item.type === 'personality')
                      .map(item => (
                        <DraggableItemComponent key={item.id} item={item} />
                      ))}
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {availableItems
                      .filter(item => item.type === 'role')
                      .map(item => (
                        <DraggableItemComponent key={item.id} item={item} />
                      ))}
                  </Box>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>

          {/* Character Building Area */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DropZone
                  title="Appearance"
                  items={appearanceItems}
                  accepts={['appearance']}
                  onItemAdd={() => {}}
                  onItemRemove={(id) => handleItemRemove(id, 'appearance')}
                  icon={<PaletteIcon />}
                  color="purple"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DropZone
                  title="Personality"
                  items={personalityItems}
                  accepts={['personality']}
                  onItemAdd={() => {}}
                  onItemRemove={(id) => handleItemRemove(id, 'personality')}
                  icon={<PersonalityIcon />}
                  color="green"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DropZone
                  title="Role"
                  items={roleItems}
                  accepts={['role']}
                  onItemAdd={() => {}}
                  onItemRemove={(id) => handleItemRemove(id, 'role')}
                  icon={<RoleIcon />}
                  color="red"
                />
              </Grid>

              {selectedAgeGroup === '11-16' && (
                <Grid item xs={12} sm={6}>
                  <DropZone
                    title="Goals"
                    items={goalsItems}
                    accepts={['goals']}
                    onItemAdd={() => {}}
                    onItemRemove={(id) => handleItemRemove(id, 'goals')}
                    icon={<GoalsIcon />}
                    color="blue"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        <DragOverlay>
          {activeItem ? <DraggableItemComponent item={activeItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Character Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Character Preview</DialogTitle>
        <DialogContent>
          {currentCharacter && (
            <CharacterPreview character={currentCharacter} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Character Templates Dialog */}
      <Dialog
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Choose a Character Template</DialogTitle>
        <DialogContent>
          <CharacterTemplates
            ageGroup={selectedAgeGroup}
            onTemplateSelect={handleLoadTemplate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplatesOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
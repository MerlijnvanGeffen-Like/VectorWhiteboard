import React from 'react';
import { Box, Button, Slider, IconButton } from '@mui/material';
import {
  Create as PenIcon,
  Mouse as SelectIcon,
  OpenWith as MoveIcon,
  Delete as EraserIcon,
  AutoFixHigh as LassoIcon,
  Delete as ClearIcon,
  Note as PostItIcon,
  Group as GroupIcon,
  Poll as PollIcon,
  Help as QuizIcon,
} from '@mui/icons-material';
import styled from 'styled-components';

const ColorSquare = styled.div<{ color: string; selected?: boolean }>`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#1976d2' : '#ccc'};
  border-radius: 4px;
  cursor: pointer;
  margin: 0 4px;
  &:hover {
    border-color: #1976d2;
  }
`;

const ToolbarContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
  gap: 8px;
`;

const colors = [
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFA500',
  '#800080',
  '#008080',
  '#FF69B4',
];

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onModeChange: (mode: string) => void;
  currentColor: string;
  currentWidth: number;
  currentMode: string;
  onClearAll?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onColorChange,
  onWidthChange,
  onModeChange,
  currentColor,
  currentWidth,
  currentMode,
  onClearAll,
}) => {
  return (
    <ToolbarContainer>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => onModeChange('draw')}
          color={currentMode === 'draw' ? 'primary' : 'default'}
        >
          <PenIcon />
        </IconButton>
        <IconButton
          onClick={() => onModeChange('select')}
          color={currentMode === 'select' ? 'primary' : 'default'}
        >
          <SelectIcon />
        </IconButton>
        <IconButton
          onClick={() => onModeChange('move')}
          color={currentMode === 'move' ? 'primary' : 'default'}
        >
          <MoveIcon />
        </IconButton>
        <IconButton
          onClick={() => onModeChange('eraser')}
          color={currentMode === 'eraser' ? 'primary' : 'default'}
        >
          <EraserIcon />
        </IconButton>
        <IconButton
          onClick={() => onModeChange('lasso')}
          color={currentMode === 'lasso' ? 'primary' : 'default'}
        >
          <LassoIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {colors.map((color) => (
          <ColorSquare
            key={color}
            color={color}
            selected={color === currentColor}
            onClick={() => onColorChange(color)}
          />
        ))}
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          style={{ width: 24, height: 24, padding: 0, border: 'none' }}
        />
      </Box>

      <Box sx={{ width: 200, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={currentWidth}
          onChange={(_, value) => onWidthChange(value as number)}
          min={1}
          max={20}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="error" onClick={onClearAll} title="Clean All">
          <ClearIcon />
        </IconButton>
        <IconButton onClick={() => onModeChange('postit')} title="Post-it">
          <PostItIcon color={currentMode === 'postit' ? 'primary' : 'inherit'} />
        </IconButton>
      </Box>
    </ToolbarContainer>
  );
};

export default Toolbar; 
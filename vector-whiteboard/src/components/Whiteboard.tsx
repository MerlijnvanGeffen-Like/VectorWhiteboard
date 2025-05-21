import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';
import MiniWhiteboard, { MiniWhiteboardHandle } from './MiniWhiteboard';

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: ${props => props.mode === 'move' ? 'grab' : 'crosshair'};
  &:active {
    cursor: ${props => props.mode === 'move' ? 'grabbing' : 'crosshair'};
  }
`;

interface Point {
  x: number;
  y: number;
}

interface PathData {
  points: Point[];
  color: string;
  width: number;
  id: string;
  type: 'drawing' | 'postit';
  text?: string;
  postitSize?: { w: number; h: number };
  postitDrawing?: any;
}

interface WhiteboardProps {
  currentColor: string;
  currentWidth: number;
  currentMode: string;
  onClearAll?: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({
  currentColor,
  currentWidth,
  currentMode,
  onClearAll,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState<Point>({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 2000, height: 900 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  const [draggedPostit, setDraggedPostit] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizingPostit, setResizingPostit] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ mouse: Point; size: { w: number; h: number } } | null>(null);
  const postitRefs = useRef<{ [id: string]: MiniWhiteboardHandle | null }>({});
  const [draggingSelection, setDraggingSelection] = useState(false);
  const [selectionDragStart, setSelectionDragStart] = useState<Point | null>(null);

  const HITBOX_SIZE = 20; // Increased hitbox size for easier selection

  const getMousePosition = (event: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((event.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    return { x, y };
  };

  const isPointNearPath = (point: Point, path: PathData): boolean => {
    if (path.type === 'postit') {
      // For post-its, check if point is within the post-it area
      const postitWidth = 200;
      const postitHeight = 150;
      return (
        point.x >= path.points[0].x &&
        point.x <= path.points[0].x + postitWidth &&
        point.y >= path.points[0].y &&
        point.y <= path.points[0].y + postitHeight
      );
    }

    // For drawings, check if point is near any point in the path
    return path.points.some(p => 
      Math.abs(p.x - point.x) < HITBOX_SIZE && 
      Math.abs(p.y - point.y) < HITBOX_SIZE
    );
  };

  const startDrawing = (event: React.MouseEvent) => {
    const point = getMousePosition(event);
    
    // Post-it select/drag/resize
    if (currentMode === 'select') {
      // Check if we clicked on a post-it resize handle
      const clickedPostit = paths.find(
        p => p.type === 'postit' &&
          point.x >= p.points[0].x + (p.postitSize?.w ?? 200) - 16 &&
          point.x <= p.points[0].x + (p.postitSize?.w ?? 200) &&
          point.y >= p.points[0].y + (p.postitSize?.h ?? 150) - 16 &&
          point.y <= p.points[0].y + (p.postitSize?.h ?? 150)
      );
      if (clickedPostit) {
        setResizingPostit(clickedPostit.id);
        setResizeStart({
          mouse: point,
          size: clickedPostit.postitSize || { w: 200, h: 150 },
        });
        return;
      }
      // Check if we clicked on a post-it body
      const clickedBody = paths.find(
        p => p.type === 'postit' &&
          point.x >= p.points[0].x &&
          point.x <= p.points[0].x + (p.postitSize?.w ?? 200) &&
          point.y >= p.points[0].y &&
          point.y <= p.points[0].y + (p.postitSize?.h ?? 150)
      );
      if (clickedBody) {
        setSelectedPaths(new Set([clickedBody.id]));
        setDraggedPostit(clickedBody.id);
        setDragOffset({ x: point.x - clickedBody.points[0].x, y: point.y - clickedBody.points[0].y });
        return;
      }
      // Check if we clicked on a drawing path (multi-select drag)
      const clickedDrawing = paths.find(
        p => p.type === 'drawing' &&
          p.points.some(pt => Math.abs(pt.x - point.x) < HITBOX_SIZE && Math.abs(pt.y - point.y) < HITBOX_SIZE)
      );
      if (clickedDrawing && selectedPaths.has(clickedDrawing.id)) {
        setDraggingSelection(true);
        setSelectionDragStart(point);
        return;
      }
      if (clickedDrawing) {
        setSelectedPaths(new Set([clickedDrawing.id]));
        setDraggingSelection(true);
        setSelectionDragStart(point);
        return;
      }
    }
    
    if (currentMode === 'move') {
      setIsPanning(true);
      setPanStart(point);
      return;
    }
    
    switch (currentMode) {
      case 'draw':
        setIsDrawing(true);
        setCurrentPath({
          points: [point],
          color: currentColor,
          width: currentWidth,
          id: Date.now().toString(),
          type: 'drawing'
        });
        break;
      case 'select':
        // Check if we clicked on a path
        const clickedPath = paths.find(path => isPointNearPath(point, path));
        if (clickedPath) {
          setSelectedPaths(new Set([clickedPath.id]));
        } else {
          setSelectedPaths(new Set());
        }
        break;
      case 'eraser':
        const pathToErase = paths.find(path => isPointNearPath(point, path));
        if (pathToErase) {
          setPaths(paths.filter(p => p.id !== pathToErase.id));
        }
        break;
      case 'lasso':
        setIsDrawing(true);
        setLassoPoints([point]);
        break;
      case 'postit':
        const newPostit: PathData = {
          points: [point],
          color: currentColor,
          width: currentWidth,
          id: Date.now().toString(),
          type: 'postit',
          text: 'Click to edit',
          postitSize: { w: 200, h: 150 },
          postitDrawing: [],
        };
        setPaths(prev => [...prev, newPostit]);
        break;
    }
  };

  const draw = (event: React.MouseEvent) => {
    const point = getMousePosition(event);
    
    // Post-it drag
    if (draggedPostit) {
      setPaths(prev => prev.map(p => {
        if (p.id !== draggedPostit) return p;
        const oldX = p.points[0].x;
        const oldY = p.points[0].y;
        const newX = point.x - dragOffset.x;
        const newY = point.y - dragOffset.y;
        const dx = newX - oldX;
        const dy = newY - oldY;
        let newDrawing = p.postitDrawing;
        if (Array.isArray(newDrawing)) {
          newDrawing = newDrawing.map((path: any) => ({
            ...path,
            points: path.points.map((pt: any) => ({ x: pt.x + dx, y: pt.y + dy }))
          }));
        }
        return {
          ...p,
          points: [{ x: newX, y: newY }],
          postitDrawing: newDrawing,
        };
      }));
      return;
    }
    // Post-it resize
    if (resizingPostit && resizeStart) {
      setPaths(prev => prev.map(p =>
        p.id === resizingPostit
          ? { ...p, postitSize: {
              w: Math.max(60, resizeStart.size.w + (point.x - resizeStart.mouse.x)),
              h: Math.max(40, resizeStart.size.h + (point.y - resizeStart.mouse.y)),
            } }
          : p
      ));
      return;
    }
    
    if (isPanning && currentMode === 'move') {
      const dx = point.x - panStart.x;
      const dy = point.y - panStart.y;
      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy
      }));
      setPanStart(point);
      return;
    }
    
    if (currentMode === 'draw' && isDrawing && currentPath) {
      setCurrentPath(prev => ({
        ...prev!,
        points: [...prev!.points, point]
      }));
    } else if (currentMode === 'lasso' && isDrawing) {
      setLassoPoints(prev => [...prev, point]);
    }
    
    // Multi-select drag
    if (draggingSelection && selectionDragStart) {
      const dx = point.x - selectionDragStart.x;
      const dy = point.y - selectionDragStart.y;
      setPaths(prev => prev.map(p =>
        selectedPaths.has(p.id)
          ? {
              ...p,
              points: p.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy }))
            }
          : p
      ));
      setSelectionDragStart(point);
      return;
    }
  };

  const endDrawing = () => {
    setDraggedPostit(null);
    setResizingPostit(null);
    setDraggingSelection(false);
    setSelectionDragStart(null);
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (currentMode === 'draw' && isDrawing && currentPath) {
      setPaths(prev => [...prev, currentPath]);
      setCurrentPath(null);
      setIsDrawing(false);
    } else if (currentMode === 'lasso' && isDrawing && lassoPoints.length > 2) {
      // Select all paths that intersect with the lasso
      const selected = paths.filter(path => 
        path.points.some(p => isPointInPolygon(p, lassoPoints))
      );
      setSelectedPaths(new Set(selected.map(p => p.id)));
      setLassoPoints([]);
      setIsDrawing(false);
    }
  };

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Clean all function
  const handleClearAll = () => {
    setPaths([]);
    setCurrentPath(null);
    setSelectedPaths(new Set());
    if (onClearAll) onClearAll();
  };

  // Post-it tekenen opslaan
  const handlePostitDraw = (id: string, paths: any) => {
    setPaths(prev => prev.map(p =>
      p.id === id ? { ...p, postitDrawing: paths } : p
    ));
  };

  return (
    <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <SVGContainer
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        mode={currentMode}
      >
        <g>
          {paths.map((path) => (
            path.type === 'postit' ? (
              <g key={path.id}>
                <rect
                  x={path.points[0].x}
                  y={path.points[0].y}
                  width={path.postitSize?.w ?? 200}
                  height={path.postitSize?.h ?? 150}
                  fill={path.color}
                  stroke="#000"
                  strokeWidth={1}
                  opacity={selectedPaths.has(path.id) ? 0.7 : 1}
                />
                <foreignObject
                  x={path.points[0].x + 4}
                  y={path.points[0].y + 4}
                  width={(path.postitSize?.w ?? 200) - 8}
                  height={(path.postitSize?.h ?? 150) - 8}
                  style={{ pointerEvents: currentMode === 'draw' ? 'auto' : 'none' }}
                >
                  <MiniWhiteboard
                    width={(path.postitSize?.w ?? 200) - 8}
                    height={(path.postitSize?.h ?? 150) - 8}
                    initialPaths={path.postitDrawing}
                    onChange={paths => handlePostitDraw(path.id, paths)}
                    offsetX={0}
                    offsetY={0}
                  />
                </foreignObject>
                {/* Resize handle */}
                <rect
                  x={path.points[0].x + (path.postitSize?.w ?? 200) - 16}
                  y={path.points[0].y + (path.postitSize?.h ?? 150) - 16}
                  width={16}
                  height={16}
                  fill="#fff"
                  stroke="#888"
                  strokeWidth={1}
                  style={{ cursor: 'nwse-resize' }}
                />
              </g>
            ) : (
              <path
                key={path.id}
                d={path.points.reduce((acc, point, i) => {
                  return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                }, '')}
                stroke={path.color}
                strokeWidth={path.width}
                fill="none"
                strokeOpacity={selectedPaths.has(path.id) ? 0.5 : 1}
              />
            )
          ))}
          {currentPath && currentPath.type === 'drawing' && (
            <path
              d={currentPath.points.reduce((acc, point, i) => {
                return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
              }, '')}
              stroke={currentPath.color}
              strokeWidth={currentPath.width}
              fill="none"
            />
          )}
          {lassoPoints.length > 0 && (
            <path
              d={lassoPoints.reduce((acc, point, i) => {
                return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
              }, '')}
              stroke="#1976d2"
              strokeWidth={1}
              fill="none"
              strokeDasharray="5,5"
            />
          )}
        </g>
      </SVGContainer>
    </Box>
  );
};

export default Whiteboard; 
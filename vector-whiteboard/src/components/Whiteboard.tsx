import React, { useRef, useState, forwardRef, useEffect } from 'react';
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
  pressure?: number;
  tiltX?: number;
  tiltY?: number;
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

interface WhiteboardHandle {
  clear: () => void;
  getPaths: () => PathData[];
  setPaths: (paths: PathData[]) => void;
}

interface WhiteboardProps {
  width?: number;
  height?: number;
  color?: string;
  lineWidth?: number;
  onChange?: (paths: PathData[]) => void;
  initialPaths?: PathData[];
  style?: React.CSSProperties;
  offsetX?: number;
  offsetY?: number;
  mode?: 'draw' | 'erase';
  currentColor: string;
  currentWidth: number;
  currentMode: string;
  onClearAll?: () => void;
}

const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(({
  width = 800,
  height = 600,
  color = '#222',
  lineWidth = 4,
  onChange,
  initialPaths = [],
  style,
  offsetX = 0,
  offsetY = 0,
  mode = 'draw',
  currentColor,
  currentWidth,
  currentMode,
  onClearAll,
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);
  const [paths, setPaths] = useState<PathData[]>(initialPaths || []);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState<Point>({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 2000, height: 1200 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [viewBoxStart, setViewBoxStart] = useState<{ x: number; y: number } | null>(null);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  const [draggedPostit, setDraggedPostit] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizingPostit, setResizingPostit] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{mouse: Point, width: number, height: number} | null>(null);
  const postitRefs = useRef<{ [id: string]: MiniWhiteboardHandle | null }>({});
  const [draggingSelection, setDraggingSelection] = useState(false);
  const [selectionDragStart, setSelectionDragStart] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const DRAG_THRESHOLD = 5; // pixels

  const HITBOX_SIZE = 20;
  const RESOLUTION_SCALE = 4;
  // Zeer hoge resolutie voor scherpe details
  const RESOLUTION_SCALE_HIGH = 8;

  // Lasso tool: select and move multiple paths
  const [lassoActive, setLassoActive] = useState(false);
  const [lassoStart, setLassoStart] = useState<Point | null>(null);
  const [lassoEnd, setLassoEnd] = useState<Point | null>(null);

  // Select tool: select and move a single path
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectStart, setSelectStart] = useState<Point | null>(null);
  const [selectOffset, setSelectOffset] = useState<{dx: number, dy: number}>({dx: 0, dy: 0});

  // Post-it tool: add sticky notes
  const [postits, setPostits] = useState<{id: string, x: number, y: number, width: number, height: number, drawing?: any[]}[]>([]);
  const [editingPostitId, setEditingPostitId] = useState<string | null>(null);
  const [draggedPostitId, setDraggedPostitId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [resizingPostitId, setResizingPostitId] = useState<string | null>(null);

  // Catmull-Rom spline interpolatie voor smooth lijnen
  function catmullRomSpline(points: Point[], numPoints: number = 32): Point[] {
    if (points.length < 2) return points;
    const result: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1] || points[i];
      const p3 = points[i + 2] || p2;
      for (let t = 0; t < numPoints; t++) {
        const tt = t / numPoints;
        const tt2 = tt * tt;
        const tt3 = tt2 * tt;
        const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * tt + (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * tt2 + (-p0.x + 3*p1.x - 3*p2.x + p3.x) * tt3);
        const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * tt + (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * tt2 + (-p0.y + 3*p1.y - 3*p2.y + p3.y) * tt3);
        result.push({ x, y });
      }
    }
    result.push(points[points.length - 1]);
    return result;
  }

  const getMousePosition = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent): Point | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    let clientX: number;
    let clientY: number;
    let pressure: number = 1;
    let tiltX: number = 0;
    let tiltY: number = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      pressure = (e.touches[0] as any).force || 1;
    } else if ('pointerType' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
      pressure = e.pressure || 1;
      tiltX = e.tiltX || 0;
      tiltY = e.tiltY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    // Map to SVG coordinates (no RESOLUTION_SCALE)
    return {
      x: (clientX - rect.left) * viewBox.width / rect.width + viewBox.x,
      y: (clientY - rect.top) * viewBox.height / rect.height + viewBox.y,
      pressure,
      tiltX,
      tiltY
    };
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

  const createPoint = (pos: Point) => {
    const newPath = {
      points: [pos],
      color: currentColor,
      width: currentWidth,
      id: Date.now().toString(),
      type: 'drawing' as const
    };
    setPaths(prev => [...prev, newPath]);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (currentMode === 'eraser' || currentMode === 'move' || currentMode === 'lasso' || currentMode === 'select' || currentMode === 'postit') return;
    const pos = getMousePosition(e);
    if (!pos) return;
    setIsDragging(false);
    setStartPos(pos);
    setIsDrawing(true);
    const newPath: PathData = {
      points: [pos],
      color: currentColor,
      width: currentWidth,
      id: Date.now().toString(),
      type: 'drawing' as const
    };
    setCurrentPath(newPath);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!isDrawing || !currentPath || !startPos) return;
    const pos = getMousePosition(e);
    if (!pos) return;
    // Downsample: only add point if distance > 2px
    const last = currentPath.points[currentPath.points.length - 1];
    const dx = pos.x - last.x;
    const dy = pos.y - last.y;
    if (Math.sqrt(dx * dx + dy * dy) < 2) return;
    setCurrentPath(prev => prev ? { ...prev, points: [...prev.points, pos] } : prev);
    setIsDragging(true);
  };

  const endDrawing = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    setStartPos(null);
    setPaths(prev => [...prev, currentPath]);
    setCurrentPath(null);
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

  // Lasso drag state
  const [lassoDrag, setLassoDrag] = useState<{start: Point, offset: {dx: number, dy: number}} | null>(null);

  // Update tool logic in handlePointerDown
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const pos = getMousePosition(e);
    if (!pos) return;
    if (currentMode === 'move') {
      setIsPanning(true);
      setPanStart(pos);
      setViewBoxStart({ x: viewBox.x, y: viewBox.y });
      return;
    }
    if (currentMode === 'eraser') {
      const pathIndex = paths.findIndex(path => isPointNearPath(pos, path));
      if (pathIndex !== -1) {
        const newPaths = [...paths];
        newPaths.splice(pathIndex, 1);
        setPaths(newPaths);
        if (onChange) onChange(newPaths);
      }
      return;
    }
    if (currentMode === 'lasso') {
      // If already selected, check if pointer is inside selection to start drag
      if (selectedPaths.size > 0) {
        // Check if pointer is inside any selected path
        const selectedPathObjs = paths.filter(p => selectedPaths.has(p.id));
        if (selectedPathObjs.some(path => isPointNearPath(pos, path))) {
          setLassoDrag({ start: pos, offset: { dx: 0, dy: 0 } });
          return;
        }
      }
      setLassoActive(true);
      setLassoStart(pos);
      setLassoEnd(pos);
      setSelectedPaths(new Set());
      return;
    }
    if (currentMode === 'select') {
      // Check if a sticky note resize handle is clicked
      const postit = postits.find(p =>
        pos.x >= p.x + (p.width || 160) - 16 && pos.x <= p.x + (p.width || 160) &&
        pos.y >= p.y + (p.height || 60) - 16 && pos.y <= p.y + (p.height || 60)
      );
      if (postit) {
        setResizingPostitId(postit.id);
        setResizeStart({ mouse: pos, width: postit.width, height: postit.height });
        return;
      }
      // Check if a sticky note is clicked
      const postit2 = postits.find(p => pos.x >= p.x && pos.x <= p.x + (p.width || 160) && pos.y >= p.y && pos.y <= p.y + (p.height || 60));
      if (postit2) {
        setDraggedPostitId(postit2.id);
        setDragStart({ x: pos.x - postit2.x, y: pos.y - postit2.y });
        return;
      }
      // Select the topmost path
      const pathIndex = paths.findIndex(path => isPointNearPath(pos, path));
      if (pathIndex !== -1) {
        setSelectedPathId(paths[pathIndex].id);
        setSelectStart(pos);
        setSelectOffset({dx: 0, dy: 0});
      } else {
        setSelectedPathId(null);
      }
      return;
    }
    if (currentMode === 'postit') {
      // Add a post-it at the clicked position
      setPostits(prev => [...prev, {id: Date.now().toString(), x: pos.x, y: pos.y, width: 160, height: 60, drawing: []}]);
      return;
    }
    startDrawing(e);
  };

  // Update tool logic in handlePointerMove
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const pos = getMousePosition(e);
    if (!pos) return;
    if (isPanning && panStart && viewBoxStart) {
      const dx = (pos.x - panStart.x);
      const dy = (pos.y - panStart.y);
      setViewBox({ ...viewBox, x: viewBoxStart.x - dx, y: viewBoxStart.y - dy });
      return;
    }
    if (lassoDrag && selectedPaths.size > 0) {
      // Move all selected paths visually
      setLassoDrag(drag => drag ? { ...drag, offset: { dx: pos.x - drag.start.x, dy: pos.y - drag.start.y } } : null);
      return;
    }
    if (lassoActive && lassoStart) {
      setLassoEnd(pos);
      // Select all paths within the lasso rectangle
      const minX = Math.min(lassoStart.x, pos.x);
      const maxX = Math.max(lassoStart.x, pos.x);
      const minY = Math.min(lassoStart.y, pos.y);
      const maxY = Math.max(lassoStart.y, pos.y);
      const selected = new Set(paths.filter(path => path.points.some(p => p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY)).map(p => p.id));
      setSelectedPaths(selected);
      return;
    }
    if (selectedPathId && selectStart) {
      // Move the selected path
      const dx = pos.x - selectStart.x;
      const dy = pos.y - selectStart.y;
      setSelectOffset({dx, dy});
      return;
    }
    if (resizingPostitId && resizeStart) {
      setPostits(prev => prev.map(p =>
        p.id === resizingPostitId
          ? { ...p, width: Math.max(40, resizeStart.width + (pos.x - resizeStart.mouse.x)), height: Math.max(30, resizeStart.height + (pos.y - resizeStart.mouse.y)) }
          : p
      ));
      return;
    }
    if (draggedPostitId && dragStart) {
      setPostits(prev => prev.map(p => p.id === draggedPostitId ? { ...p, x: pos.x - dragStart.x, y: pos.y - dragStart.y } : p));
      return;
    }
    draw(e);
  };

  // Update tool logic in handlePointerUp
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      setViewBoxStart(null);
      return;
    }
    if (resizingPostitId) {
      setResizingPostitId(null);
      setResizeStart(null);
      return;
    }
    if (draggedPostitId) {
      setDraggedPostitId(null);
      setDragStart(null);
      return;
    }
    if (lassoDrag && selectedPaths.size > 0) {
      // Commit the move of all selected paths
      const dx = lassoDrag.offset.dx;
      const dy = lassoDrag.offset.dy;
      setPaths(prev => prev.map(p => selectedPaths.has(p.id)
        ? { ...p, points: p.points.map(pt => ({ ...pt, x: pt.x + dx, y: pt.y + dy })) }
        : p
      ));
      setLassoDrag(null);
      return;
    }
    if (lassoActive && lassoStart && lassoEnd) {
      setLassoActive(false);
      setLassoStart(null);
      setLassoEnd(null);
      return;
    }
    if (selectedPathId && selectStart) {
      // Commit the move of the selected path
      const dx = selectOffset.dx;
      const dy = selectOffset.dy;
      setPaths(prev => prev.map(p => p.id === selectedPathId ? {
        ...p,
        points: p.points.map(pt => ({...pt, x: pt.x + dx, y: pt.y + dy}))
      } : p));
      setSelectedPathId(null);
      setSelectStart(null);
      setSelectOffset({dx: 0, dy: 0});
      return;
    }
    endDrawing();
  };

  // Render paths met Catmull-Rom interpolatie
  const renderPaths = () => {
    let allPaths = isDrawing && currentPath ? [...paths, currentPath] : paths;
    if (lassoDrag && selectedPaths.size > 0) {
      // Apply offset to selected paths
      allPaths = allPaths.map(p => selectedPaths.has(p.id)
        ? { ...p, points: p.points.map(pt => ({ ...pt, x: pt.x + lassoDrag.offset.dx, y: pt.y + lassoDrag.offset.dy })) }
        : p
      );
    }
    return allPaths.map(path => {
      if (path.type === 'drawing') {
        const points = path.points;
        if (points.length === 1) {
          // Render direct een klein punt met drukgevoeligheid
          const pressure = points[0].pressure || 1;
          return (
            <circle
              key={path.id}
              cx={points[0].x}
              cy={points[0].y}
              r={(path.width * pressure) / 4}
              fill={path.color}
              fillOpacity={0.5 + (pressure * 0.5)} // Opacity based on pressure
            />
          );
        }
        // Smooth lijn met drukgevoeligheid en tilt
        const smoothPoints = catmullRomSpline(points, 24);
        const d = smoothPoints.reduce((acc: string, point: Point, i: number) => {
          if (i === 0) return `M ${point.x} ${point.y}`;
          return `${acc} L ${point.x} ${point.y}`;
        }, '');

        // Calculate average pressure for the path
        const avgPressure = points.reduce((sum, p) => sum + (p.pressure || 1), 0) / points.length;
        const avgTiltX = points.reduce((sum, p) => sum + (p.tiltX || 0), 0) / points.length;
        const avgTiltY = points.reduce((sum, p) => sum + (p.tiltY || 0), 0) / points.length;

        return (
          <path
            key={path.id}
            d={d}
            stroke={path.color}
            strokeWidth={path.width * avgPressure}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              vectorEffect: 'non-scaling-stroke',
              opacity: 0.5 + (avgPressure * 0.5),
              filter: `blur(${Math.abs(avgTiltX) * 0.2}px)` // Subtle blur based on tilt
            }}
          />
        );
      }
      return null;
    });
  };

  // Helper: draw grid background (optimized)
  const renderGrid = () => {
    const gridSize = 80;
    const minX = Math.floor(viewBox.x / gridSize) * gridSize;
    const maxX = Math.ceil((viewBox.x + viewBox.width) / gridSize) * gridSize;
    const minY = Math.floor(viewBox.y / gridSize) * gridSize;
    const maxY = Math.ceil((viewBox.y + viewBox.height) / gridSize) * gridSize;
    const lines = [];
    let vCount = 0, hCount = 0, maxLines = 20;
    for (let x = minX; x <= maxX && vCount < maxLines; x += gridSize, vCount++) {
      lines.push(<line key={`vx${x}`} x1={x} y1={minY} x2={x} y2={maxY} stroke="#eee" strokeWidth={1} />);
    }
    for (let y = minY; y <= maxY && hCount < maxLines; y += gridSize, hCount++) {
      lines.push(<line key={`hz${y}`} x1={minX} y1={y} x2={maxX} y2={y} stroke="#eee" strokeWidth={1} />);
    }
    return lines;
  };

  // Render post-its as fully drawable MiniWhiteboards, resizable, no text
  const renderPostits = () => postits.map(postit => (
    <foreignObject key={postit.id} x={postit.x} y={postit.y} width={postit.width || 160} height={postit.height || 60} style={{overflow:'visible'}}>
      <div
        style={{
          background: '#fffbe6',
          border: '2px solid #ffd700',
          borderRadius: 12,
          width: postit.width || 160,
          height: postit.height || 60,
          padding: 0,
          boxShadow: '0 2px 8px #0002',
          cursor: currentMode === 'select' ? 'move' : 'pointer',
          userSelect: 'none',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MiniWhiteboard
          width={postit.width || 160}
          height={postit.height || 60}
          initialPaths={postit.drawing || []}
          mode={currentMode === 'eraser' ? 'eraser' : 'draw'}
          onChange={paths => setPostits(prev => prev.map(p => p.id === postit.id ? { ...p, drawing: paths } : p))}
          style={{ background: 'transparent', border: 'none', borderRadius: 8 }}
        />
        {/* Resize handle */}
        {currentMode === 'select' && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 16,
              height: 16,
              background: '#ffd700',
              borderRadius: '0 0 12px 0',
              cursor: 'nwse-resize',
              zIndex: 2,
              border: '1px solid #e2b800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            ↘
          </div>
        )}
      </div>
    </foreignObject>
  ));

  // Add this effect to handle global pointerup for sticky note dragging
  useEffect(() => {
    if (!draggedPostitId) return;
    const handleUp = () => {
      setDraggedPostitId(null);
      setDragStart(null);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, [draggedPostitId]);

  return (
    <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <SVGContainer
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none', background: '#fff' }}
        mode={currentMode}
      >
        <g>
          {renderGrid()}
          {renderPaths()}
          {renderPostits()}
          {lassoActive && lassoStart && lassoEnd && (
            <rect
              x={Math.min(lassoStart.x, lassoEnd.x)}
              y={Math.min(lassoStart.y, lassoEnd.y)}
              width={Math.abs(lassoEnd.x - lassoStart.x)}
              height={Math.abs(lassoEnd.y - lassoStart.y)}
              fill="#2196f333"
              stroke="#2196f3"
              strokeDasharray="6,4"
              strokeWidth={2}
            />
          )}
        </g>
      </SVGContainer>
    </Box>
  );
});

export default Whiteboard; 
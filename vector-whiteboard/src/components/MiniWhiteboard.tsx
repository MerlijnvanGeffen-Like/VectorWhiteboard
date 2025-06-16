import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import styled from 'styled-components';

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: crosshair;
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
  postitDrawing?: any[];
}

export interface MiniWhiteboardHandle {
  getPaths: () => PathData[];
  clear: () => void;
}

interface MiniWhiteboardProps {
  width?: number;
  height?: number;
  color?: string;
  lineWidth?: number;
  onChange?: (paths: PathData[]) => void;
  initialPaths?: PathData[];
  style?: React.CSSProperties;
  offsetX?: number;
  offsetY?: number;
  mode?: 'draw' | 'eraser';
}

const MiniWhiteboard = forwardRef<MiniWhiteboardHandle, MiniWhiteboardProps>(({
  width = 400,
  height = 120,
  color = '#222',
  lineWidth = 4,
  onChange,
  initialPaths = [],
  style,
  offsetX = 0,
  offsetY = 0,
  mode = 'draw',
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);
  const [paths, setPaths] = useState<PathData[]>(initialPaths);
  const [realSize, setRealSize] = useState<{w: number, h: number}>({ w: width, h: height });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const DRAG_THRESHOLD = 5; // pixels

  useImperativeHandle(ref, () => ({
    getPaths: () => paths,
    clear: () => setPaths([]),
  }), [paths]);

  // Responsief: meet de echte breedte/hoogte
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setRealSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    const ro = new (window as any).ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const getMousePosition = (event: React.MouseEvent | React.TouchEvent | React.PointerEvent): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    let clientX: number;
    let clientY: number;
    let pressure = 1;
    let tiltX = 0;
    let tiltY = 0;

    if ('touches' in event) {
      const touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      // @ts-ignore - force is available on touch events but not in TypeScript types
      pressure = touch.force || 1;
    } else if ('pointerType' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
      pressure = event.pressure || 1;
      tiltX = event.tiltX || 0;
      tiltY = event.tiltY || 0;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: (clientX - rect.left) / rect.width * realSize.w,
      y: (clientY - rect.top) / rect.height * realSize.h,
      pressure,
      tiltX,
      tiltY
    };
  };

  const handlePathMouseDown = (e: React.MouseEvent, id: string) => {
    if (mode === 'eraser') {
      e.stopPropagation();
      const newPaths = paths.filter(p => p.id !== id);
      setPaths(newPaths);
      if (onChange) onChange(newPaths);
    }
  };

  const handlePathPointerDown = (e: React.PointerEvent, id: string) => {
    if (mode === 'eraser') {
      e.stopPropagation();
      const newPaths = paths.filter(p => p.id !== id);
      setPaths(newPaths);
      if (onChange) onChange(newPaths);
    }
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (event.stopPropagation) event.stopPropagation();
    if (mode === 'eraser') return;
    const point = getMousePosition(event);
    setIsDragging(false);
    setStartPos(point);
    setIsDrawing(true);
    const newPath: PathData = {
      points: [point],
      color,
      width: lineWidth,
      id: Date.now().toString(),
      type: 'drawing' as const
    };
    setCurrentPath(newPath);
    setPaths(prev => {
      const newPaths = [...prev, newPath];
      if (onChange) {
        onChange(newPaths);
      }
      return newPaths;
    });
  };

  const draw = (event: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (event.stopPropagation) event.stopPropagation();
    if (mode === 'eraser') return;
    if (!isDrawing || !currentPath || !startPos) return;
    const point = getMousePosition(event);

    // Check if we've moved enough to consider this a drag
    const dx = point.x - startPos.x;
    const dy = point.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > DRAG_THRESHOLD) {
      setIsDragging(true);
    }

    // Voeg het nieuwe punt toe aan de lijn
    const updatedPath: PathData = {
      ...currentPath,
      points: [...currentPath.points, point]
    };
    setCurrentPath(updatedPath);
    setPaths(prev => {
      const newPaths = prev.map(p => p.id === currentPath.id ? updatedPath : p);
      if (onChange) {
        onChange(newPaths);
      }
      return newPaths;
    });
  };

  const endDrawing = (event?: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (event && event.stopPropagation) event.stopPropagation();
    if (mode === 'eraser') return;
    if (!isDrawing) return;

    // Als we niet hebben gesleept, behouden we alleen het eerste punt
    if (!isDragging && currentPath) {
      setPaths(prev => {
        const newPaths = prev.map(p => p.id === currentPath.id ? {
          ...p,
          points: [p.points[0]]
        } : p);
        if (onChange) {
          onChange(newPaths);
        }
        return newPaths;
      });
    }

    setIsDrawing(false);
    setCurrentPath(null);
    setIsDragging(false);
    setStartPos(null);
  };

  // Add smooth line interpolation
  const interpolatePoints = (points: Point[]): Point[] => {
    if (points.length < 2) return points;
    
    const result: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      result.push(current);
      
      // Add interpolated points for smoother lines
      const distance = Math.sqrt(
        Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
      );
      
      if (distance > 5) {
        const steps = Math.floor(distance / 5);
        for (let j = 1; j < steps; j++) {
          const t = j / steps;
          result.push({
            x: current.x + (next.x - current.x) * t,
            y: current.y + (next.y - current.y) * t,
            pressure: current.pressure && next.pressure 
              ? current.pressure + (next.pressure - current.pressure) * t 
              : undefined
          });
        }
      }
    }
    result.push(points[points.length - 1]);
    return result;
  };

  return (
    <div ref={containerRef} style={{ width, height, ...style }}>
      <SVGContainer
        ref={svgRef}
        width={realSize.w}
        height={realSize.h}
        viewBox={`0 0 ${realSize.w} ${realSize.h}`}
        onMouseDown={e => { startDrawing(e); }}
        onMouseMove={e => { draw(e); }}
        onMouseUp={e => { endDrawing(e); }}
        onMouseLeave={e => { endDrawing(e); }}
        onTouchStart={e => { startDrawing(e); }}
        onTouchMove={e => { draw(e); }}
        onTouchEnd={e => { endDrawing(e); }}
        onPointerDown={e => { startDrawing(e); }}
        onPointerMove={e => { draw(e); }}
        onPointerUp={e => { endDrawing(e); }}
        onPointerLeave={e => { endDrawing(e); }}
        style={{ cursor: mode === 'eraser' ? 'pointer' : 'crosshair', touchAction: 'none' }}
      >
        <g>
          {paths.map((path) => {
            const avgPressure = path.points.reduce((sum, p) => sum + (p.pressure || 1), 0) / path.points.length;
            const avgTiltX = path.points.reduce((sum, p) => sum + (p.tiltX || 0), 0) / path.points.length;
            return (
            <path
              key={path.id}
              d={interpolatePoints(path.points).reduce((acc, point, i) => {
                const x = point.x + offsetX;
                const y = point.y + offsetY;
                return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
              }, '')}
              stroke={path.color}
                strokeWidth={path.width * avgPressure}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseDown={e => handlePathMouseDown(e, path.id)}
              onPointerDown={e => handlePathPointerDown(e, path.id)}
                style={{
                  cursor: mode === 'eraser' ? 'pointer' : 'crosshair',
                  opacity: 0.5 + (avgPressure * 0.5),
                  filter: `blur(${Math.abs(avgTiltX) * 0.2}px)`
                }}
              />
            );
          })}
        </g>
      </SVGContainer>
    </div>
  );
});

export default MiniWhiteboard; 
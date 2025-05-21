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
}

interface PathData {
  points: Point[];
  color: string;
  width: number;
  id: string;
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
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);
  const [paths, setPaths] = useState<PathData[]>(initialPaths);
  const [realSize, setRealSize] = useState<{w: number, h: number}>({ w: width, h: height });

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

  const getMousePosition = (event: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * realSize.w;
    const y = ((event.clientY - rect.top) / rect.height) * realSize.h;
    return { x, y };
  };

  const startDrawing = (event: React.MouseEvent) => {
    const point = getMousePosition(event);
    setIsDrawing(true);
    setCurrentPath({
      points: [point],
      color,
      width: lineWidth,
      id: Date.now().toString(),
    });
  };

  const draw = (event: React.MouseEvent) => {
    if (!isDrawing || !currentPath) return;
    const point = getMousePosition(event);
    setCurrentPath(prev => ({
      ...prev!,
      points: [...prev!.points, point],
    }));
  };

  const endDrawing = () => {
    if (isDrawing && currentPath) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      setCurrentPath(null);
      setIsDrawing(false);
      if (onChange) onChange(newPaths);
    }
  };

  return (
    <div ref={containerRef} style={{ width, height, ...style }}>
      <SVGContainer
        ref={svgRef}
        width={realSize.w}
        height={realSize.h}
        viewBox={`0 0 ${realSize.w} ${realSize.h}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      >
        <g>
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.points.reduce((acc, point, i) => {
                const x = point.x + offsetX;
                const y = point.y + offsetY;
                return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
              }, '')}
              stroke={path.color}
              strokeWidth={path.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath && (
            <path
              d={currentPath.points.reduce((acc, point, i) => {
                const x = point.x + offsetX;
                const y = point.y + offsetY;
                return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
              }, '')}
              stroke={currentPath.color}
              strokeWidth={currentPath.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
      </SVGContainer>
    </div>
  );
});

export default MiniWhiteboard; 
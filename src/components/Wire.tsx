'use client';

import { useDrag, useDrop } from 'react-dnd';
import { useRef, useEffect } from 'react';

interface WireConnection {
  id: number;
  color: string;
  isConnected: boolean;
  connectedTo: number | null;
}

interface WireProps {
  wire: WireConnection;
  position: 'left' | 'right';
  onConnect: (leftId: number, rightId: number) => void;
  wires: {
    left: WireConnection[];
    right: WireConnection[];
  };
}

export default function Wire({ wire, position, onConnect, wires }: WireProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'WIRE',
    item: { id: wire.id, color: wire.color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'WIRE',
    drop: (item: { id: number, color: string }) => {
      if (position === 'right' && !wire.isConnected) {
        onConnect(item.id, wire.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (position === 'left') {
      drag(ref);
    } else {
      drop(ref);
    }
  }, [drag, drop, position]);

  const isFullyConnected = () => {
    if (!wire.isConnected || wire.connectedTo === null) return false;
    const otherWires = position === 'left' ? wires.right : wires.left;
    const connectedWire = otherWires.find(w => w.id === wire.connectedTo);
    return connectedWire?.isConnected === true;
  };

  const getLineStyle = () => {
    return {
      position: 'absolute' as const,
      height: '10px',
      width: wire.color === 'red' || wire.color === 'blue' ? '250px' : '250px',
      backgroundColor: wire.color,
      top: '50%',
      left: '40px',
      transform: `translateY(-50%) ${wire.color === 'yellow' ? 'rotate(17deg)' : wire.color === 'pink' ? 'rotate(-17deg)' : ''}`,
      transformOrigin: 'left',
      zIndex: 1,
    };
  };

  return (
    <div className="relative flex items-center">
      <div
        ref={ref}
        className={`
          w-10 h-10 rounded-full 
          transition-all duration-300 ease-in-out
          ${isDragging ? 'scale-110 opacity-70' : ''}
          ${isOver && canDrop ? 'scale-125' : ''}
          ${wire.isConnected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
          ${position === 'left' && !wire.isConnected ? 'cursor-grab active:cursor-grabbing hover:scale-110' : ''}
          ${position === 'right' && canDrop ? 'cursor-pointer hover:scale-110' : ''}
        `}
        style={{
          backgroundColor: wire.color,
          position: 'relative',
          zIndex: 2
        }}
      >
        {wire.isConnected && (
          <div className="absolute top-1/2 left-1/2 w-6 h-6 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        )}
      </div>
      {isFullyConnected() && position === 'left' && (
        <div style={getLineStyle()} />
      )}
    </div>
  );
}
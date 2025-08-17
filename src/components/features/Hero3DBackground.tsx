'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, Suspense, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';

function FloatingGeometry({ position, color, geometry }: {
  position: [number, number, number];
  color: string;
  geometry: 'box' | 'sphere' | 'cone';
}) {
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();
  
  const initialPosition = useMemo(() => new Vector3(...position), [position]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle floating motion
      meshRef.current.position.y = initialPosition.y + Math.sin(time * 0.5) * 0.5;
      meshRef.current.position.x = initialPosition.x + Math.cos(time * 0.3) * 0.3;
      
      // Subtle rotation
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 16, 16]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 8]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      <GeometryComponent />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.7}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function BackgroundScene() {
  return (
    <>
      {/* Soft lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      
      {/* Floating geometric elements */}
      <FloatingGeometry position={[3, 2, -2]} color="#3b82f6" geometry="sphere" />
      <FloatingGeometry position={[-3, -1, -3]} color="#8b5cf6" geometry="box" />
      <FloatingGeometry position={[0, 3, -4]} color="#10b981" geometry="cone" />
      <FloatingGeometry position={[4, -2, -2]} color="#f59e0b" geometry="sphere" />
      <FloatingGeometry position={[-2, 1, -5]} color="#ef4444" geometry="box" />
    </>
  );
}

interface Hero3DBackgroundProps {
  className?: string;
  enabled?: boolean;
}

export function Hero3DBackground({ className = '', enabled = true }: Hero3DBackgroundProps) {
  // Progressive enhancement - only show on capable devices
  if (!enabled || typeof window === 'undefined') {
    return null;
  }

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false
        }}
        dpr={[1, 1.2]}
        performance={{ min: 0.5 }}
        frameloop="demand"
      >
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
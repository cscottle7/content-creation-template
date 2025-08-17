'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import { Mesh } from 'three';

function AnimatedSphere({ position, color, scale = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <AnimatedSphere position={[2, 0, 0]} color="#3b82f6" scale={0.8} />
      <AnimatedSphere position={[-2, 1, -1]} color="#8b5cf6" scale={0.6} />
      <AnimatedSphere position={[0, -1, 1]} color="#10b981" scale={0.4} />
    </>
  );
}

interface Hero3DProps {
  className?: string;
}

export function Hero3D({ className = '' }: Hero3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
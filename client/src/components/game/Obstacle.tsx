import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";

interface ObstacleProps {
  position: [number, number, number];
  size: [number, number, number];
  type: 'spike' | 'block';
}

export default function Obstacle({ position, size, type }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gamePhase } = useGameState();

  useFrame((state, delta) => {
    if (!meshRef.current || gamePhase !== 'playing') return;
    
    // Rotate obstacles for visual effect
    meshRef.current.rotation.y += delta * 2;
  });

  const getColor = () => {
    switch (type) {
      case 'spike':
        return "#ff4757";
      case 'block':
        return "#2f3542";
      default:
        return "#ff4757";
    }
  };

  const getGeometry = () => {
    switch (type) {
      case 'spike':
        return <coneGeometry args={[size[0], size[1], 4]} />;
      case 'block':
        return <boxGeometry args={size} />;
      default:
        return <boxGeometry args={size} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {getGeometry()}
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";

interface CollectibleProps {
  position: [number, number, number];
  onCollect: () => void;
}

export default function Collectible({ position, onCollect }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gamePhase } = useGameState();

  useFrame((state, delta) => {
    if (!meshRef.current || gamePhase !== 'playing') return;
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    meshRef.current.rotation.y += delta * 3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 8, 6]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.2} />
    </mesh>
  );
}

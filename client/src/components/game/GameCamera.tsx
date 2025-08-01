import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";

export default function GameCamera() {
  const { camera } = useThree();
  const { gamePhase } = useGameState();
  const targetPosition = useRef(new THREE.Vector3(0, 5, 10));
  const currentPosition = useRef(new THREE.Vector3(0, 5, 10));

  useFrame((state, delta) => {
    if (gamePhase !== 'playing') return;

    // Follow the player with some offset
    // In a real implementation, you'd get the player position from a ref or context
    const playerZ = state.clock.elapsedTime * 5; // Simulate player moving forward
    
    targetPosition.current.set(0, 5, playerZ + 10);
    
    // Smooth camera movement
    currentPosition.current.lerp(targetPosition.current, delta * 2);
    camera.position.copy(currentPosition.current);
    
    // Look slightly ahead of the player
    camera.lookAt(0, 0, playerZ + 5);
  });

  // Reset camera when game restarts
  useEffect(() => {
    if (gamePhase === 'ready') {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
      currentPosition.current.set(0, 5, 10);
      targetPosition.current.set(0, 5, 10);
    }
  }, [gamePhase, camera]);

  return null;
}

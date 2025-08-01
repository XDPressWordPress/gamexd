import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { generatePlatforms, generateObstacles, generateCollectibles } from "../../lib/gameLogic";

import Player from "./Player";
import Platform from "./Platform";
import Obstacle from "./Obstacle";
import Collectible from "./Collectible";

export default function GameWorld() {
  const { gamePhase, addScore } = useGameState();
  const { playSuccess } = useAudio();
  const playerRef = useRef<THREE.Group>(null);
  
  // Generate world elements
  const platforms = useMemo(() => generatePlatforms(), []);
  const obstacles = useMemo(() => generateObstacles(), []);
  const [collectibles, setCollectibles] = useMemo(() => {
    const items = generateCollectibles();
    return [items, (newItems: any[]) => {}]; // Simplified for now
  }, []);

  // Ground plane
  const Ground = () => (
    <mesh position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#4ecdc4" />
    </mesh>
  );

  const handleCollectible = (index: number) => {
    playSuccess();
    addScore(100);
    // Remove collectible (simplified - in a real game you'd update state)
  };

  return (
    <group>
      {/* Ground */}
      <Ground />
      
      {/* Player */}
      <Player />
      
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <Platform
          key={`platform-${index}`}
          position={platform.position}
          size={platform.size}
        />
      ))}
      
      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <Obstacle
          key={`obstacle-${index}`}
          position={obstacle.position}
          size={obstacle.size}
          type={obstacle.type}
        />
      ))}
      
      {/* Collectibles */}
      {collectibles.map((collectible, index) => (
        <Collectible
          key={`collectible-${index}`}
          position={collectible.position}
          onCollect={() => handleCollectible(index)}
        />
      ))}
    </group>
  );
}

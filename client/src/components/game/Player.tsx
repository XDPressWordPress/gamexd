import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";

enum Controls {
  jump = 'jump',
  left = 'left',
  right = 'right'
}

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gamePhase, endGame, addScore } = useGameState();
  const { playHit } = useAudio();
  const [subscribe, getState] = useKeyboardControls<Controls>();
  
  // Player physics state
  const playerState = useRef({
    position: new THREE.Vector3(0, 2, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    isGrounded: false,
    jumpPower: 12,
    moveSpeed: 8,
    gravity: -25,
    maxFallSpeed: -20
  });

  // Touch controls for mobile
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (gamePhase === 'playing') {
        const touch = e.touches[0];
        const screenWidth = window.innerWidth;
        
        if (touch.clientX < screenWidth / 3) {
          // Left side - move left
          playerState.current.velocity.x = -playerState.current.moveSpeed;
        } else if (touch.clientX > (screenWidth * 2) / 3) {
          // Right side - move right
          playerState.current.velocity.x = playerState.current.moveSpeed;
        } else {
          // Center - jump
          if (playerState.current.isGrounded) {
            playerState.current.velocity.y = playerState.current.jumpPower;
            playerState.current.isGrounded = false;
            playHit();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      playerState.current.velocity.x = 0;
    };

    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gamePhase, playHit]);

  useFrame((state, delta) => {
    if (!meshRef.current || gamePhase !== 'playing') return;

    const controls = getState();
    const player = playerState.current;

    // Handle keyboard input
    if (controls.jump && player.isGrounded) {
      player.velocity.y = player.jumpPower;
      player.isGrounded = false;
      playHit();
    }

    if (controls.left) {
      player.velocity.x = -player.moveSpeed;
    } else if (controls.right) {
      player.velocity.x = player.moveSpeed;
    } else if (Math.abs(player.velocity.x) > 0.1) {
      player.velocity.x *= 0.9; // Friction
    } else {
      player.velocity.x = 0;
    }

    // Apply gravity
    player.velocity.y += player.gravity * delta;
    player.velocity.y = Math.max(player.velocity.y, player.maxFallSpeed);

    // Update position
    player.position.x += player.velocity.x * delta;
    player.position.y += player.velocity.y * delta;
    player.position.z += 5 * delta; // Constant forward movement

    // Constrain horizontal movement
    player.position.x = Math.max(-8, Math.min(8, player.position.x));

    // Ground collision (simple)
    if (player.position.y <= 1) {
      player.position.y = 1;
      player.velocity.y = 0;
      player.isGrounded = true;
    }

    // Check if player fell off the world
    if (player.position.y < -10) {
      endGame();
    }

    // Update mesh position
    meshRef.current.position.copy(player.position);

    // Add score based on distance
    addScore(Math.floor(delta * 10));
  });

  // Reset player position when game restarts
  useEffect(() => {
    if (gamePhase === 'ready') {
      playerState.current.position.set(0, 2, 0);
      playerState.current.velocity.set(0, 0, 0);
      playerState.current.isGrounded = false;
      if (meshRef.current) {
        meshRef.current.position.copy(playerState.current.position);
      }
    }
  }, [gamePhase]);

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  );
}

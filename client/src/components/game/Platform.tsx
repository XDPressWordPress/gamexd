import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
}

export default function Platform({ position, size }: PlatformProps) {
  const texture = useTexture("/textures/wood.jpg");
  
  // Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(size[0] / 2, size[2] / 2);

  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

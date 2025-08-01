export default function Lights() {
  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for shadows and definition */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Point light for dynamic lighting */}
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
}

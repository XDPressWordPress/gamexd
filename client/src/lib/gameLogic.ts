interface Platform {
  position: [number, number, number];
  size: [number, number, number];
}

interface Obstacle {
  position: [number, number, number];
  size: [number, number, number];
  type: 'spike' | 'block';
}

interface Collectible {
  position: [number, number, number];
}

export function generatePlatforms(): Platform[] {
  const platforms: Platform[] = [];
  
  // Generate platforms along the Z axis
  for (let z = 0; z < 500; z += 8) {
    // Main platform
    platforms.push({
      position: [0, 0, z],
      size: [16, 1, 6]
    });
    
    // Side platforms (randomly placed)
    if (Math.random() > 0.3) {
      const side = Math.random() > 0.5 ? -6 : 6;
      platforms.push({
        position: [side, 2, z + 4],
        size: [4, 1, 4]
      });
    }
    
    // Jump platforms
    if (Math.random() > 0.5) {
      platforms.push({
        position: [Math.random() * 8 - 4, 4, z + 6],
        size: [3, 1, 3]
      });
    }
  }
  
  return platforms;
}

export function generateObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = [];
  
  for (let z = 10; z < 500; z += 12) {
    // Random obstacle placement
    if (Math.random() > 0.4) {
      const x = (Math.random() - 0.5) * 12;
      const type = Math.random() > 0.5 ? 'spike' : 'block';
      
      obstacles.push({
        position: [x, type === 'spike' ? 1.5 : 1.5, z],
        size: type === 'spike' ? [1, 3, 1] : [2, 2, 2],
        type
      });
    }
  }
  
  return obstacles;
}

export function generateCollectibles(): Collectible[] {
  const collectibles: Collectible[] = [];
  
  for (let z = 5; z < 500; z += 15) {
    // Random collectible placement
    if (Math.random() > 0.3) {
      const x = (Math.random() - 0.5) * 10;
      collectibles.push({
        position: [x, 3, z]
      });
    }
  }
  
  return collectibles;
}

export function checkCollision(
  pos1: [number, number, number],
  size1: [number, number, number],
  pos2: [number, number, number],
  size2: [number, number, number]
): boolean {
  const [x1, y1, z1] = pos1;
  const [w1, h1, d1] = size1;
  const [x2, y2, z2] = pos2;
  const [w2, h2, d2] = size2;
  
  return (
    Math.abs(x1 - x2) < (w1 + w2) / 2 &&
    Math.abs(y1 - y2) < (h1 + h2) / 2 &&
    Math.abs(z1 - z2) < (d1 + d2) / 2
  );
}

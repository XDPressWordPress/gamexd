import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from '../lib/stores/useGameState';
import { useAudio } from '../lib/stores/useAudio';
import TouchControls from './game/TouchControls';
import { useIsMobile } from '../hooks/use-is-mobile';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Platform extends GameObject {
  type: 'ground' | 'floating';
}

interface Enemy extends GameObject {
  speed: number;
  direction: number;
  alive: boolean;
  deathAnimation: number;
}

interface Coin extends GameObject {
  collected: boolean;
  bounce: number;
}

interface Portal extends GameObject {
  active: boolean;
  animation: number;
}

export default function Game2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { gamePhase, addScore, endGame } = useGameState();
  const { playHit, playSuccess } = useAudio();
  const isMobile = useIsMobile();
  
  // Game state
  const [player, setPlayer] = useState({
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velX: 0,
    velY: 0,
    speed: 5,
    jumpPower: 12,
    onGround: false,
    color: '#ff6b6b'
  });

  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState<{[key: string]: boolean}>({});
  const [touchControls, setTouchControls] = useState({ 
    left: false, 
    right: false, 
    jump: false 
  });
  
  // Game objects
  const platforms: Platform[] = [
    // Ground platforms
    { x: 0, y: 450, width: 800, height: 50, color: '#4ecdc4', type: 'ground' },
    { x: 800, y: 450, width: 600, height: 50, color: '#4ecdc4', type: 'ground' },
    { x: 1500, y: 450, width: 800, height: 50, color: '#4ecdc4', type: 'ground' },
    
    // Floating platforms
    { x: 300, y: 350, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 500, y: 280, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 700, y: 320, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 950, y: 380, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 1200, y: 300, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 1400, y: 250, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 1650, y: 350, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
    { x: 1850, y: 280, width: 120, height: 20, color: '#45b7d1', type: 'floating' },
  ];

  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 400, y: 320, width: 25, height: 25, color: '#ff4757', speed: 1, direction: 1, alive: true, deathAnimation: 0 },
    { x: 750, y: 290, width: 25, height: 25, color: '#ff4757', speed: 1.5, direction: -1, alive: true, deathAnimation: 0 },
    { x: 1250, y: 270, width: 25, height: 25, color: '#ff4757', speed: 1, direction: 1, alive: true, deathAnimation: 0 },
    { x: 1700, y: 320, width: 25, height: 25, color: '#ff4757', speed: 1.2, direction: -1, alive: true, deathAnimation: 0 },
  ]);

  const [portal, setPortal] = useState<Portal>({
    x: 2000, y: 350, width: 40, height: 60, color: '#9b59b6', active: false, animation: 0
  });

  const [coins, setCoins] = useState<Coin[]>([
    { x: 350, y: 320, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 550, y: 250, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 750, y: 290, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 1000, y: 350, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 1250, y: 270, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 1450, y: 220, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 1700, y: 320, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
    { x: 1900, y: 250, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
  ]);

  // Touch control handlers
  const handleTouchMove = useCallback((direction: 'left' | 'right' | 'stop') => {
    setTouchControls(prev => ({
      ...prev,
      left: direction === 'left',
      right: direction === 'right'
    }));
  }, []);

  const handleTouchJump = useCallback(() => {
    setTouchControls(prev => ({ ...prev, jump: true }));
    setTimeout(() => {
      setTouchControls(prev => ({ ...prev, jump: false }));
    }, 100);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Collision detection
  const checkCollision = (rect1: GameObject, rect2: GameObject): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Advanced collision detection for enemy stomping
  const checkEnemyStomp = (player: any, enemy: Enemy): 'stomp' | 'side' | 'none' => {
    if (!checkCollision(player, enemy)) return 'none';
    
    // Check if player is falling and landing on top of enemy
    const playerBottom = player.y + player.height;
    const enemyTop = enemy.y;
    const verticalOverlap = playerBottom - enemyTop;
    
    // If player velocity is downward and overlap is small, it's a stomp
    if (player.velY > 0 && verticalOverlap < 10) {
      return 'stomp';
    }
    
    return 'side';
  };

  // Game loop
  const gameLoop = useCallback(() => {
    if (gamePhase !== 'playing') return;

    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };
      
      // Handle input (keyboard + touch)
      if (keys.ArrowLeft || keys.KeyA || touchControls.left) {
        newPlayer.velX = -newPlayer.speed;
      } else if (keys.ArrowRight || keys.KeyD || touchControls.right) {
        newPlayer.velX = newPlayer.speed;
      } else {
        newPlayer.velX *= 0.8; // Friction
      }

      if ((keys.Space || keys.ArrowUp || keys.KeyW || touchControls.jump) && newPlayer.onGround) {
        newPlayer.velY = -newPlayer.jumpPower;
        newPlayer.onGround = false;
        playHit();
      }

      // Apply gravity
      newPlayer.velY += 0.6;
      if (newPlayer.velY > 15) newPlayer.velY = 15; // Terminal velocity

      // Update position
      newPlayer.x += newPlayer.velX;
      newPlayer.y += newPlayer.velY;

      // Platform collision
      newPlayer.onGround = false;
      platforms.forEach(platform => {
        if (checkCollision(newPlayer, platform)) {
          // Landing on top
          if (newPlayer.velY > 0 && newPlayer.y < platform.y) {
            newPlayer.y = platform.y - newPlayer.height;
            newPlayer.velY = 0;
            newPlayer.onGround = true;
          }
        }
      });

      // Enemy collision with stomping mechanic
      enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        const collisionType = checkEnemyStomp(newPlayer, enemy);
        
        if (collisionType === 'stomp') {
          // Player stomped on enemy - kill enemy and bounce player
          enemy.alive = false;
          enemy.deathAnimation = 1;
          newPlayer.velY = -8; // Bounce effect
          addScore(200); // Bonus points for killing enemy
          playSuccess();
        } else if (collisionType === 'side') {
          // Player hit enemy from side/bottom - game over
          endGame();
        }
      });

      // Check coin collection
      coins.forEach(coin => {
        if (!coin.collected && checkCollision(newPlayer, coin)) {
          coin.collected = true;
          addScore(100);
          playSuccess();
        }
      });

      // Check if all coins collected - activate portal
      const allCoinsCollected = coins.every(coin => coin.collected);
      if (allCoinsCollected && !portal.active) {
        portal.active = true;
      }

      // Portal collision - next level
      if (portal.active && checkCollision(newPlayer, portal)) {
        // Reset level with more coins and harder enemies
        coins.forEach(coin => {
          coin.collected = false;
          coin.bounce = 0;
        });
        
        // Add more coins for next level
        const newCoins = [
          { x: 2200, y: 320, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
          { x: 2400, y: 250, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
          { x: 2600, y: 180, width: 20, height: 20, color: '#ffd700', collected: false, bounce: 0 },
        ];
        
        coins.push(...newCoins);
        portal.active = false;
        addScore(500); // Level completion bonus
        playSuccess();
      }

      // Check if player fell
      if (newPlayer.y > 600) {
        endGame();
      }

      return newPlayer;
    });

    // Update camera to follow player
    setCamera(prevCamera => ({
      x: Math.max(0, player.x - 400),
      y: 0
    }));

    // Update enemies
    enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.x += enemy.speed * enemy.direction;
        
        // Reverse direction at platform edges
        const currentPlatform = platforms.find(p => 
          enemy.x >= p.x && enemy.x <= p.x + p.width
        );
        
        if (currentPlatform) {
          if (enemy.x <= currentPlatform.x || enemy.x >= currentPlatform.x + currentPlatform.width - enemy.width) {
            enemy.direction *= -1;
          }
        }
      } else {
        // Death animation
        enemy.deathAnimation += 0.1;
      }
    });

    // Update coin bounce animation
    coins.forEach(coin => {
      coin.bounce += 0.1;
    });

    // Update portal animation
    if (portal.active) {
      portal.animation += 0.15;
    }

  }, [gamePhase, keys, touchControls, player, addScore, endGame, playHit, playSuccess]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      gameLoop();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (gamePhase === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gamePhase]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with branding
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw XD Plans branding in background
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    // XD Plans logo repeatedly across background
    for (let x = 200; x < 2500; x += 400) {
      for (let y = 100; y < 400; y += 120) {
        ctx.fillText('XD PLANS', x - camera.x, y);
      }
    }
    
    // David Xavier name in smaller text
    ctx.font = 'bold 24px Arial';
    ctx.globalAlpha = 0.08;
    for (let x = 300; x < 2500; x += 400) {
      for (let y = 150; y < 400; y += 120) {
        ctx.fillText('David Xavier', x - camera.x, y);
      }
    }
    ctx.restore();

    // Save context for camera translation
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Draw platforms
    platforms.forEach(platform => {
      ctx.fillStyle = platform.color;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add some styling
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(platform.x, platform.y, platform.width, 5);
    });

    // Draw coins
    coins.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = coin.color;
        const bounceOffset = Math.sin(coin.bounce) * 5;
        ctx.fillRect(coin.x, coin.y + bounceOffset, coin.width, coin.height);
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(coin.x + 2, coin.y + bounceOffset + 2, coin.width - 8, coin.height - 8);
      }
    });

    // Draw enemies
    enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Add eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 4, 4);
        ctx.fillRect(enemy.x + 15, enemy.y + 5, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 6, enemy.y + 6, 2, 2);
        ctx.fillRect(enemy.x + 16, enemy.y + 6, 2, 2);
      } else if (enemy.deathAnimation < 2) {
        // Death animation - fade and shrink
        const alpha = Math.max(0, 1 - enemy.deathAnimation);
        const scale = Math.max(0, 1 - enemy.deathAnimation * 0.5);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#666';
        const shrunkWidth = enemy.width * scale;
        const shrunkHeight = enemy.height * scale;
        ctx.fillRect(
          enemy.x + (enemy.width - shrunkWidth) / 2, 
          enemy.y + (enemy.height - shrunkHeight) / 2, 
          shrunkWidth, 
          shrunkHeight
        );
        ctx.restore();
      }
    });

    // Draw portal (when active)
    if (portal.active) {
      const portalPulse = Math.sin(portal.animation) * 0.3 + 0.7;
      
      // Portal outer ring
      ctx.save();
      ctx.globalAlpha = portalPulse;
      ctx.fillStyle = portal.color;
      ctx.fillRect(portal.x - 5, portal.y - 5, portal.width + 10, portal.height + 10);
      
      // Portal inner area
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
      
      // Portal sparkles
      ctx.globalAlpha = portalPulse;
      ctx.fillStyle = '#f1c40f';
      for (let i = 0; i < 5; i++) {
        const sparkleX = portal.x + Math.sin(portal.animation + i) * 20 + portal.width / 2;
        const sparkleY = portal.y + Math.cos(portal.animation + i) * 30 + portal.height / 2;
        ctx.fillRect(sparkleX - 2, sparkleY - 2, 4, 4);
      }
      
      ctx.restore();
      
      // Portal text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PORTAL', portal.x + portal.width / 2, portal.y - 10);
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Add player details
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 5, player.y + 5, 6, 6);
    ctx.fillRect(player.x + 18, player.y + 5, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 7, player.y + 7, 2, 2);
    ctx.fillRect(player.x + 20, player.y + 7, 2, 2);
    
    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 20, 8, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  });

  // Reset game state when starting
  useEffect(() => {
    if (gamePhase === 'ready') {
      setPlayer(prev => ({ ...prev, x: 100, y: 300, velX: 0, velY: 0 }));
      setCamera({ x: 0, y: 0 });
      // Reset coins
      coins.forEach(coin => {
        coin.collected = false;
        coin.bounce = 0;
      });
      // Reset enemies
      setEnemies([
        { x: 400, y: 320, width: 25, height: 25, color: '#ff4757', speed: 1, direction: 1, alive: true, deathAnimation: 0 },
        { x: 750, y: 290, width: 25, height: 25, color: '#ff4757', speed: 1.5, direction: -1, alive: true, deathAnimation: 0 },
        { x: 1250, y: 270, width: 25, height: 25, color: '#ff4757', speed: 1, direction: 1, alive: true, deathAnimation: 0 },
        { x: 1700, y: 320, width: 25, height: 25, color: '#ff4757', speed: 1.2, direction: -1, alive: true, deathAnimation: 0 },
      ]);
      // Reset portal
      setPortal({ x: 2000, y: 350, width: 40, height: 60, color: '#9b59b6', active: false, animation: 0 });
    }
  }, [gamePhase]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          display: 'block',
          margin: '0 auto',
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      />
      {isMobile && gamePhase === 'playing' && (
        <TouchControls
          onMove={handleTouchMove}
          onJump={handleTouchJump}
        />
      )}
    </>
  );
}
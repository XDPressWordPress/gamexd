import { useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Import game components
import Game2D from "./components/Game2D";
import GameUI from "./components/game/GameUI";
import SoundManager from "./components/game/SoundManager";

// Main App component
function App() {
  const { gamePhase } = useGameState();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {gamePhase === 'playing' && <Game2D />}
      <GameUI />
      <SoundManager />
    </div>
  );
}

export default App;

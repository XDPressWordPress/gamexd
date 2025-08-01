import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  gamePhase: GamePhase;
  score: number;
  highScore: number;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  resetScore: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "ready",
    score: 0,
    highScore: parseInt(localStorage.getItem('endlessRunner_highScore') || '0'),
    
    startGame: () => {
      set((state) => {
        if (state.gamePhase === "ready") {
          return { gamePhase: "playing", score: 0 };
        }
        return {};
      });
    },
    
    restartGame: () => {
      set((state) => ({
        gamePhase: "ready",
        score: 0
      }));
    },
    
    endGame: () => {
      set((state) => {
        if (state.gamePhase === "playing") {
          const newHighScore = Math.max(state.score, state.highScore);
          localStorage.setItem('endlessRunner_highScore', newHighScore.toString());
          return { 
            gamePhase: "ended",
            highScore: newHighScore
          };
        }
        return {};
      });
    },

    addScore: (points: number) => {
      set((state) => {
        if (state.gamePhase === "playing") {
          return { score: state.score + points };
        }
        return {};
      });
    },

    resetScore: () => {
      set({ score: 0 });
    }
  }))
);

import { useState } from "react";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import IntroScreen from "./IntroScreen";

export default function GameUI() {
  const { gamePhase, score, highScore, startGame, restartGame } = useGameState();
  const { toggleMute, isMuted } = useAudio();
  const [showCredits, setShowCredits] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const renderGameMenu = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <Card className="p-8 text-center max-w-md mx-4 bg-white/90 backdrop-blur">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Super Jump 2D</h1>
        <p className="text-gray-600 mb-6">Colete moedas, evite inimigos e pule entre plataformas!</p>
        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <p>🏃 Use A/D, ← → ou botões touch para mover</p>
          <p>🦘 Use W/Espaço, ↑ ou botão PULAR para saltar</p>
          <p>🪙 Colete moedas para ganhar pontos</p>
          <p>👹 Pule em cima dos inimigos para matá-los</p>
        </div>
        <div className="space-y-4">
          <Button onClick={startGame} size="lg" className="w-full mobile-ui">
            Começar Jogo
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={toggleMute} variant="outline" className="w-full mobile-ui">
              Som: {isMuted ? 'OFF' : 'ON'}
            </Button>
            <Button onClick={() => setShowCredits(true)} variant="outline" className="w-full mobile-ui">
              Créditos
            </Button>
          </div>
        </div>
        {highScore > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            Recorde: {highScore.toLocaleString()} pontos
          </p>
        )}
      </Card>
    </div>
  );

  const renderGameOver = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <Card className="p-8 text-center max-w-md mx-4 bg-white/90 backdrop-blur">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Game Over!</h2>
        <div className="space-y-2 mb-6">
          <p className="text-xl text-gray-700">Pontuação: {score.toLocaleString()}</p>
          <p className="text-lg text-gray-600">Recorde: {highScore.toLocaleString()}</p>
          {score === highScore && score > 0 && (
            <p className="text-green-600 font-bold">🎉 Novo Recorde!</p>
          )}
        </div>
        <div className="space-y-4">
          <Button onClick={restartGame} size="lg" className="w-full mobile-ui">
            Jogar Novamente
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={toggleMute} variant="outline" className="w-full mobile-ui">
              Som: {isMuted ? 'OFF' : 'ON'}
            </Button>
            <Button onClick={() => setShowCredits(true)} variant="outline" className="w-full mobile-ui">
              Créditos
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGameHUD = () => (
    <div className="fixed top-4 left-4 right-4 z-40">
      <div className="flex justify-between items-center">
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur">
          <p className="text-xl font-bold">Pontos: {score.toLocaleString()}</p>
        </div>
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-white hover:text-gray-300"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </div>
      </div>
      
      {/* Game Credits in Corner */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className="bg-black/50 text-white px-3 py-1 rounded text-xs backdrop-blur">
          <p className="opacity-70">XD Plans © David Xavier</p>
        </div>
      </div>
    </div>
  );

  const renderMobileControls = () => (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <div className="bg-black/70 text-white p-3 rounded-lg text-center backdrop-blur">
        <p className="text-sm">A/D = Mover | W/Espaço = Pular | Colete moedas douradas!</p>
      </div>
    </div>
  );

  const renderCredits = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <Card className="p-8 text-center max-w-md mx-4 bg-white/95 backdrop-blur">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Créditos</h2>
        
        <div className="space-y-6 mb-8">
          {/* Logo/Company Section */}
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">XD Plans</h3>
            <p className="text-gray-600 text-sm">Empresa desenvolvedora</p>
          </div>
          
          {/* Author Section */}
          <div className="border-b pb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-1">David Xavier</h4>
            <p className="text-gray-600 text-sm">Autor e Desenvolvedor Principal</p>
          </div>
          
          {/* Game Info */}
          <div>
            <h5 className="text-lg font-medium text-gray-800 mb-2">Super Jump 2D</h5>
            <p className="text-gray-500 text-xs">Jogo de Plataforma 2D</p>
            <p className="text-gray-500 text-xs">Desenvolvido com React & Canvas</p>
            <p className="text-gray-400 text-xs mt-2">© 2025 XD Plans. Todos os direitos reservados.</p>
          </div>
        </div>
        
        <Button onClick={() => setShowCredits(false)} size="lg" className="w-full">
          Voltar ao Menu
        </Button>
      </Card>
    </div>
  );

  // Show intro screen first
  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  return (
    <>
      {showCredits && renderCredits()}
      {!showCredits && gamePhase === 'ready' && renderGameMenu()}
      {!showCredits && gamePhase === 'ended' && renderGameOver()}
      {!showCredits && gamePhase === 'playing' && (
        <>
          {renderGameHUD()}
          {renderMobileControls()}
        </>
      )}
    </>
  );
}

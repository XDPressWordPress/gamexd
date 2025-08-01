import { useEffect, useState } from 'react';
import { Card } from '../ui/card';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeClass, setFadeClass] = useState('opacity-0');

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setFadeClass('opacity-100'), 100);

    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 2000);

    const timer2 = setTimeout(() => {
      setCurrentStep(2);
    }, 4000);

    const timer3 = setTimeout(() => {
      setFadeClass('opacity-0');
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFadeClass('opacity-0');
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-yellow-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-40 w-8 h-8 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <Card className={`p-12 text-center max-w-lg mx-4 bg-white/95 backdrop-blur shadow-2xl transition-all duration-500 ${fadeClass}`}>
        <div className="space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Super Jump 2D
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Credits Animation */}
          <div className="space-y-6 text-gray-700">
            <div className={`transition-all duration-1000 ${currentStep >= 0 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <p className="text-lg font-medium text-gray-600 mb-2">Criado por</p>
              <p className="text-3xl font-bold text-blue-700">XD PLANS</p>
            </div>

            <div className={`transition-all duration-1000 ${currentStep >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <p className="text-lg font-medium text-gray-600 mb-2">Desenvolvido por</p>
              <p className="text-2xl font-bold text-purple-700">David Xavier</p>
            </div>

            <div className={`transition-all duration-1000 ${currentStep >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <p className="text-sm text-gray-500">
                © 2025 - Jogo de Plataforma 2D
              </p>
            </div>
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Pular →
          </button>
        </div>
      </Card>

      {/* Bottom loading indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className={`w-2 h-2 bg-white rounded-full ${currentStep >= 0 ? 'animate-pulse' : 'opacity-30'}`}></div>
          <div className={`w-2 h-2 bg-white rounded-full ${currentStep >= 1 ? 'animate-pulse' : 'opacity-30'}`}></div>
          <div className={`w-2 h-2 bg-white rounded-full ${currentStep >= 2 ? 'animate-pulse' : 'opacity-30'}`}></div>
        </div>
      </div>
    </div>
  );
}
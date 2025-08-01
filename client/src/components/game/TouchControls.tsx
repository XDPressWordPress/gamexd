import { useEffect, useRef } from 'react';

interface TouchControlsProps {
  onMove: (direction: 'left' | 'right' | 'stop') => void;
  onJump: () => void;
}

export default function TouchControls({ onMove, onJump }: TouchControlsProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent, action: () => void) => {
      e.preventDefault();
      action();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Left button
    const leftButton = leftRef.current;
    if (leftButton) {
      const leftStart = (e: TouchEvent) => handleTouchStart(e, () => onMove('left'));
      const leftEnd = (e: TouchEvent) => {
        handleTouchEnd(e);
        onMove('stop');
      };
      
      leftButton.addEventListener('touchstart', leftStart, { passive: false });
      leftButton.addEventListener('touchend', leftEnd, { passive: false });
      leftButton.addEventListener('touchcancel', leftEnd, { passive: false });
    }

    // Right button
    const rightButton = rightRef.current;
    if (rightButton) {
      const rightStart = (e: TouchEvent) => handleTouchStart(e, () => onMove('right'));
      const rightEnd = (e: TouchEvent) => {
        handleTouchEnd(e);
        onMove('stop');
      };
      
      rightButton.addEventListener('touchstart', rightStart, { passive: false });
      rightButton.addEventListener('touchend', rightEnd, { passive: false });
      rightButton.addEventListener('touchcancel', rightEnd, { passive: false });
    }

    // Jump button
    const jumpButton = jumpRef.current;
    if (jumpButton) {
      const jumpStart = (e: TouchEvent) => handleTouchStart(e, onJump);
      
      jumpButton.addEventListener('touchstart', jumpStart, { passive: false });
    }

    return () => {
      if (leftButton) {
        leftButton.removeEventListener('touchstart', () => {});
        leftButton.removeEventListener('touchend', () => {});
        leftButton.removeEventListener('touchcancel', () => {});
      }
      if (rightButton) {
        rightButton.removeEventListener('touchstart', () => {});
        rightButton.removeEventListener('touchend', () => {});
        rightButton.removeEventListener('touchcancel', () => {});
      }
      if (jumpButton) {
        jumpButton.removeEventListener('touchstart', () => {});
      }
    };
  }, [onMove, onJump]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-between items-end px-4 pointer-events-none">
      {/* Movement Controls */}
      <div className="flex gap-2 pointer-events-auto">
        <div
          ref={leftRef}
          className="w-20 h-20 bg-blue-500/90 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl active:bg-blue-600/95 select-none border-2 border-white/30"
          role="button"
          tabIndex={0}
        >
          ←
        </div>
        <div
          ref={rightRef}
          className="w-20 h-20 bg-blue-500/90 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl active:bg-blue-600/95 select-none border-2 border-white/30"
          role="button"
          tabIndex={0}
        >
          →
        </div>
      </div>

      {/* Jump Control */}
      <div
        ref={jumpRef}
        className="w-24 h-24 bg-red-500/90 backdrop-blur rounded-full flex items-center justify-center text-white text-sm font-bold shadow-xl active:bg-red-600/95 select-none pointer-events-auto border-2 border-white/30"
        role="button"
        tabIndex={0}
      >
        PULAR
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Load audio files
    const loadAudio = async () => {
      try {
        // Background music
        const bgMusic = new Audio("/sounds/background.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        setBackgroundMusic(bgMusic);

        // Hit sound (for jumps)
        const hitSound = new Audio("/sounds/hit.mp3");
        hitSound.volume = 0.5;
        setHitSound(hitSound);

        // Success sound (for collectibles)
        const successSound = new Audio("/sounds/success.mp3");
        successSound.volume = 0.6;
        setSuccessSound(successSound);

        console.log("Audio files loaded successfully");
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
    };

    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}

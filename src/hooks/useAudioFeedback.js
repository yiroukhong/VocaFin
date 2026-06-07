import { useEffect, useRef, useCallback, useState } from 'react';
import {
  playSoundEffect,
  speakText,
  stopSpeech,
  playAudioFeedback,
  AUDIO_TYPES,
} from '@/utils/audioFeedback';

/**
 * Hook for managing audio feedback in VocaFin
 * Provides easy access to text-to-speech and sound effects
 */
export function useAudioFeedback(enableSounds = true) {
  const audioContextRef = useRef(null);
  const [audioContextReady, setAudioContextReady] = useState(false);

  // Initialize Web Audio Context on first user interaction
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
          setAudioContextReady(true);
        } catch (error) {
          console.warn('Audio context initialization failed:', error);
        }
      }
    };

    // Initialize on first interaction (required by browser autoplay policy)
    const events = ['click', 'keydown', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, initAudioContext, { once: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, initAudioContext);
      });
    };
  }, []);

  /**
   * Announce text with optional sound effect
   * @param {string} text - Text to announce
   * @param {string} soundType - Optional sound effect type
   * @param {Object} options - Additional TTS options
   */
  const announce = useCallback(
    async (text, soundType = null, options = {}) => {
      try {
        if (enableSounds && soundType && audioContextRef.current) {
          playSoundEffect(soundType, audioContextRef.current);
          // Small delay for sound to finish before speech
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (text) {
          await speakText(text, { ...options, rate: options.rate || 0.95 });
        }
      } catch (error) {
        console.error('Announcement error:', error);
      }
    },
    [enableSounds]
  );

  /**
   * Play success feedback (sound + speech)
   */
  const announceSuccess = useCallback(
    (text) => announce(text, AUDIO_TYPES.SUCCESS),
    [announce]
  );

  /**
   * Play error feedback (sound + speech)
   */
  const announceError = useCallback(
    (text) => announce(text, AUDIO_TYPES.ERROR),
    [announce]
  );

  /**
   * Play click/action feedback
   */
  const announceClick = useCallback(
    (text = null) => {
      if (enableSounds && audioContextRef.current) {
        playSoundEffect(AUDIO_TYPES.CLICK, audioContextRef.current);
      }
      if (text) {
        return speakText(text, { rate: 0.95 });
      }
    },
    [enableSounds]
  );

  /**
   * Play navigation feedback
   */
  const announceNavigation = useCallback(
    (text = null) => announce(text, AUDIO_TYPES.NAVIGATION),
    [announce]
  );

  /**
   * Play info feedback
   */
  const announceInfo = useCallback(
    (text) => announce(text, AUDIO_TYPES.INFO),
    [announce]
  );

  /**
   * Play warning feedback
   */
  const announceWarning = useCallback(
    (text) => announce(text, AUDIO_TYPES.WARNING),
    [announce]
  );

  /**
   * Stop current speech
   */
  const stop = useCallback(() => {
    stopSpeech();
  }, []);

  /**
   * Just play a sound effect without speech
   */
  const playSound = useCallback(
    (soundType) => {
      if (enableSounds && audioContextRef.current) {
        playSoundEffect(soundType, audioContextRef.current);
      }
    },
    [enableSounds]
  );

  return {
    announce,
    announceSuccess,
    announceError,
    announceClick,
    announceNavigation,
    announceInfo,
    announceWarning,
    playSound,
    stop,
    audioContextReady,
    audioContext: audioContextRef.current,
  };
}

/**
 * Enhanced version of speakText that handles errors gracefully
 * Used as a drop-in replacement for the old speakText function
 */
export function useSpeakText() {
  const { announce } = useAudioFeedback();
  
  return useCallback(
    async (text, options = {}) => {
      return announce(text, null, options);
    },
    [announce]
  );
}

/**
 * Audio Feedback System for VocaFin
 * Provides text-to-speech announcements and sound effects for accessibility
 */

export const AUDIO_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  CLICK: 'click',
  NAVIGATION: 'navigation',
};

/**
 * Generate a sine wave audio buffer for a specific tone
 * @param {AudioContext} audioContext - Web Audio API context
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 * @param {number} volume - Volume level (0-1)
 * @returns {AudioBuffer}
 */
function generateTone(audioContext, frequency, duration, volume = 0.3) {
  const sampleRate = audioContext.sampleRate;
  const samples = (sampleRate * duration) / 1000;
  const audioBuffer = audioContext.createBuffer(1, samples, sampleRate);
  const data = audioBuffer.getChannelData(0);

  for (let i = 0; i < samples; i++) {
    data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * volume;
  }

  return audioBuffer;
}

/**
 * Play a sound effect using Web Audio API
 * @param {string} type - Type of sound effect (success, error, click, etc.)
 * @param {AudioContext} audioContext - Web Audio API context
 */
export function playSoundEffect(type, audioContext = null) {
  if (!audioContext) {
    // Fallback if AudioContext is not available
    console.warn('AudioContext not available for sound effects');
    return;
  }

  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);

  const effectConfig = {
    [AUDIO_TYPES.SUCCESS]: {
      tones: [
        { freq: 523.25, duration: 150, volume: 0.3 }, // C5
        { freq: 659.25, duration: 150, volume: 0.3 }, // E5
        { freq: 783.99, duration: 250, volume: 0.3 }, // G5
      ],
      totalDuration: 600,
    },
    [AUDIO_TYPES.ERROR]: {
      tones: [
        { freq: 261.63, duration: 200, volume: 0.25 }, // C4
        { freq: 196, duration: 200, volume: 0.25 }, // G3
      ],
      totalDuration: 400,
    },
    [AUDIO_TYPES.CLICK]: {
      tones: [{ freq: 800, duration: 80, volume: 0.2 }],
      totalDuration: 80,
    },
    [AUDIO_TYPES.NAVIGATION]: {
      tones: [
        { freq: 440, duration: 100, volume: 0.25 }, // A4
        { freq: 554.37, duration: 100, volume: 0.25 }, // C#5
      ],
      totalDuration: 200,
    },
    [AUDIO_TYPES.INFO]: {
      tones: [{ freq: 440, duration: 200, volume: 0.2 }], // A4
      totalDuration: 200,
    },
    [AUDIO_TYPES.WARNING]: {
      tones: [
        { freq: 659.25, duration: 100, volume: 0.25 }, // E5
        { freq: 659.25, duration: 100, volume: 0.25 }, // E5
      ],
      totalDuration: 200,
    },
  };

  const config = effectConfig[type] || effectConfig[AUDIO_TYPES.INFO];

  let currentTime = 0;
  config.tones.forEach((tone) => {
    const buffer = generateTone(audioContext, tone.freq, tone.duration, tone.volume);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.start(audioContext.currentTime + currentTime / 1000);
    currentTime += tone.duration + 50; // 50ms gap between tones
  });

  // Fade out
  gain.gain.setValueAtTime(1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.totalDuration / 1000);
}

/**
 * Speak text using Web Speech API (Text-to-Speech)
 * @param {string} text - Text to speak
 * @param {Object} options - Configuration options
 * @returns {Promise<void>}
 */
export function speakText(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!text || !text.trim()) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const {
      rate = 1,
      pitch = 1,
      volume = 0.8,
      lang = 'en-MY',
      voiceIndex = null,
    } = options;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    // Try to select a specific voice if available
    if (voiceIndex !== null) {
      const voices = window.speechSynthesis?.getVoices();
      if (voices && voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
      }
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      reject(error);
    };

    try {
      window.speechSynthesis?.speak(utterance);
    } catch (error) {
      console.error('Failed to speak text:', error);
      reject(error);
    }
  });
}

/**
 * Stop any ongoing speech synthesis
 */
export function stopSpeech() {
  if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Get available voices for text-to-speech
 * @returns {Array}
 */
export function getAvailableVoices() {
  return window.speechSynthesis?.getVoices() || [];
}

/**
 * Create a combined audio feedback (sound effect + speech)
 * @param {string} soundType - Type of sound effect
 * @param {string} text - Text to speak
 * @param {AudioContext} audioContext - Web Audio API context
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
export async function playAudioFeedback(soundType, text, audioContext = null, options = {}) {
  try {
    if (soundType && audioContext) {
      playSoundEffect(soundType, audioContext);
      // Small delay for sound effect to finish before speech
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (text) {
      await speakText(text, options);
    }
  } catch (error) {
    console.error('Audio feedback error:', error);
  }
}

/**
 * Generate common announcements
 */
export const ANNOUNCEMENTS = {
  WELCOME: 'Welcome to VocaFin. A voice-first finance app for managing your expenses.',
  LOGIN_START: 'Press Enter or tap to log in.',
  LOGIN_SCANNING: 'Scanning identity. Please wait.',
  LOGIN_SUCCESS: 'Login successful. Opening VocaFin.',
  HOME_PAGE: 'Home page. Use arrow keys or tabs to navigate. Voice button at bottom right starts expense logging. Press Space to log an expense.',
  EXTRACT_PAGE: 'Extract document page. Tap or press Enter to extract expense from document.',
  HISTORY_PAGE: 'Transaction history page. Swipe left or right to navigate through transactions.',
  SUMMARY_PAGE: 'Budget summary page. View your spending by category.',
  VOICE_IDLE: 'Voice expense logger. Tap the screen or press Space to start speaking.',
  VOICE_LISTENING: 'Listening. Say your expense, for example: RM 10 for lunch.',
  VOICE_PROCESSING: 'Processing your input. Please wait.',
  VOICE_CONFIRM: 'Expense ready to save. Press Enter to confirm or Escape to cancel.',
  VOICE_SAVED: 'Expense saved successfully. You can add another or press Escape to return home.',
  CONFIRM_DIALOG: 'Confirmation dialog. Press Y for yes or N for no.',
  NAVIGATION_HELP: 'Use Tab key to navigate buttons. Press Enter to activate. Escape to go back.',
};

/**
 * Announce page information on load
 * @param {string} pageName - Name of the page
 * @param {string} additionalInfo - Additional information to announce
 * @returns {Promise<void>}
 */
export async function announcePageLoad(pageName, additionalInfo = '') {
  let announcement = ANNOUNCEMENTS[pageName] || pageName;
  if (additionalInfo) {
    announcement += `. ${additionalInfo}`;
  }
  return speakText(announcement, { rate: 0.95 });
}

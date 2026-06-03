import { useState, useEffect, useCallback, useRef } from 'react';

export function useVoiceInput(onResultCallback = null) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const maxDurationTimeoutRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const finalizedRef = useRef(false);
  const isListeningRef = useRef(false);
  const callbackRef = useRef(onResultCallback);

  useEffect(() => {
    callbackRef.current = onResultCallback;
  }, [onResultCallback]);

  const clearTimers = useCallback(() => {
    window.clearTimeout(silenceTimeoutRef.current);
    window.clearTimeout(maxDurationTimeoutRef.current);
  }, []);

  const finalizeTranscript = useCallback(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    clearTimers();

    const finalText = latestTranscriptRef.current.trim();
    if (finalText && callbackRef.current) {
      callbackRef.current(finalText);
    }

    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // The browser may have already stopped recognition.
      }
    }
  }, [clearTimers]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-MY';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      finalizedRef.current = false;
      latestTranscriptRef.current = '';
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
      
      maxDurationTimeoutRef.current = window.setTimeout(() => {
        finalizeTranscript();
      }, 10000);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          finalTranscript += `${event.results[i][0].transcript} `;
        } else {
          interimTranscript += `${event.results[i][0].transcript} `;
        }
      }

      const currentText = `${finalTranscript}${interimTranscript}`.trim();
      latestTranscriptRef.current = currentText;
      setTranscript(currentText);

      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = window.setTimeout(finalizeTranscript, 900);
    };

    recognition.onspeechend = () => {
      silenceTimeoutRef.current = window.setTimeout(finalizeTranscript, 350);
    };

    recognition.onerror = (event) => {
      clearTimers();
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError(event.error);
      }
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      finalizeTranscript();
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimers();
      finalizedRef.current = true;
      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors from browsers that have already ended recognition.
      }
    };
  }, [clearTimers, finalizeTranscript]);

  const startListening = useCallback(() => {
    if (isListeningRef.current) return;
    finalizedRef.current = false;
    latestTranscriptRef.current = '';
    setTranscript('');
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError(err.message || 'Microphone access error');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    finalizeTranscript();
  }, [finalizeTranscript]);

  return { transcript, isListening, error, startListening, stopListening };
}

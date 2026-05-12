// useVoiceInput — wraps the browser Web Speech API (SpeechRecognition).
// When implemented:
//   - Requests microphone permission on first call to startListening()
//   - Streams interim results into `transcript` as the user speaks
//   - Fires a final `onResult(transcript)` callback when speech ends
//   - Handles errors (permission denied, no speech detected) gracefully
//   - Cleans up the recognition instance on unmount
export function useVoiceInput() {
  return {
    transcript: '',
    isListening: false,
    startListening: () => {},
    stopListening: () => {},
  }
}

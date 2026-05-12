// Props:
//   onActivate  — () => void  — called when the user taps/clicks the button
//   isListening — boolean     — true while the mic is active (shows active state)
//
// TODO: Large round button (hero interaction element). Pulsing ring animation
// when isListening is true. Fully accessible: role="button", aria-label changes
// based on listening state, responds to Enter/Space keys.
export default function VoiceButton({ onActivate, isListening }) {
  return (
    <button
      onClick={onActivate}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-lg
        ${isListening ? 'bg-accent animate-pulse' : 'bg-surface border-4 border-accent'}`}
    >
      {isListening ? 'Listening…' : 'VoiceButton'}
    </button>
  )
}

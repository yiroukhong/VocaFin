# VocaFin Audio Feedback System Guide

## Overview

VocaFin now includes a comprehensive audio feedback system designed specifically for visually impaired users. This system provides:

- **Text-to-Speech (TTS) Announcements** - Read screen content, instructions, and status updates
- **Sound Effects** - Provide audio cues for actions (success, error, clicks, navigation)
- **Page Load Announcements** - Inform users what they can do on each screen
- **Action Feedback** - Confirm when operations complete successfully

## Architecture

### Core Components

#### 1. `audioFeedback.js` - Audio Utilities
Location: `src/utils/audioFeedback.js`

Provides low-level audio functionality:
- **`playSoundEffect(type, audioContext)`** - Play audio tones for different states
- **`speakText(text, options)`** - Text-to-speech
- **`stopSpeech()`** - Cancel ongoing speech
- **`playAudioFeedback(soundType, text, audioContext, options)`** - Combined sound + speech

Sound types available:
- `SUCCESS` - Three rising notes (C5, E5, G5)
- `ERROR` - Two descending notes (C4, G3)
- `CLICK` - Single high tone (800Hz)
- `NAVIGATION` - Two tones (A4, C#5)
- `INFO` - Single tone (440Hz)
- `WARNING` - Double tone (659.25Hz)

#### 2. `useAudioFeedback.js` - React Hook
Location: `src/hooks/useAudioFeedback.js`

Provides a React hook for audio feedback with automatic AudioContext initialization:

```javascript
const { 
  announce,           // Generic announcement with optional sound
  announceSuccess,    // Success announcement + sound
  announceError,      // Error announcement + sound
  announceClick,      // Click action feedback
  announceNavigation, // Navigation feedback
  announceInfo,       // Info announcement
  announceWarning,    // Warning announcement
  playSound,          // Play sound only
  stop,               // Stop current speech
  audioContext        // Access to AudioContext for custom sounds
} = useAudioFeedback();
```

#### 3. Enhanced `financeAccessibility.js`
Location: `src/utils/financeAccessibility.js`

Updated to export `speakText()` for backward compatibility with existing code.

## Updated Pages with Audio Feedback

### 1. **LoginPage** (`src/pages/LoginPage.jsx`)
- **Page Load**: No initial announcement (login flow starts with user interaction)
- **On Click/Enter**: "Scanning your identity. Please wait."
- **On Success**: "Login successful! Opening VocaFin."
- **Feedback**: Click sound on scanning, success sound on authentication

### 2. **HomePage** (`src/pages/HomePage.jsx`)
- **Page Load**: Announces budget info + navigation instructions
  - Budget remaining and total spent
  - Top expense category
  - Navigation help (Tab, arrow keys, Space for voice logging)
- **Button Focus**: Announces each button's purpose when focused
- **Navigation**: Click sound + announcement when navigating away
- **Feedback**: Navigation sounds for page transitions

### 3. **LogExpensePage** (`src/pages/LogExpensePage.jsx`)
- **Page Load**: "Voice expense logger. Tap to start speaking."
- **Recording Start**: "Recording. Speak now."
- **Processing**: "Processing your input. Please wait."
- **Confirmation**: "Confirming. [amount] ringgit for [category]."
- **Save Success**: "Expense saved! [amount] for [category] saved successfully."
- **New Entry**: Ready to log another expense
- **Feedback**: Click sound on recording, success sound on save, error sound on parsing failure

### 4. **ConfirmPage** (`src/pages/ConfirmPage.jsx`)
- **Page Load**: Announces transaction details + confirm/cancel instructions
- **On Confirm**: "Transaction confirmed. [amount] saved for [category]."
- **On Cancel**: "Transaction cancelled. Returning to home."
- **Feedback**: Success sound on confirm, click sound on cancel

### 5. **HistoryPage** (`src/pages/HistoryPage.jsx`)
- **Page Load**: Navigation instructions for month navigation and audio playback
- **Month Navigation**: Visual feedback (existing) + audio cues when month changes
- **Transaction Audio**: Existing audio playback functionality preserved
- **Feedback**: Navigation sounds for month changes

### 6. **SummaryPage** (`src/pages/SummaryPage.jsx`)
- **Page Load**: Budget summary + keyboard shortcuts
  - Total spent this month
  - Remaining budget
  - Keyboard shortcuts for different views
- **Interactive Buttons**: Audio cues as users explore summaries
- **Feedback**: Navigation sounds for view changes

### 7. **ExtractPage** (`src/pages/ExtractPage.jsx`)
- **Page Load**: Instructions for document upload
- **File Upload**: "N file(s) uploaded successfully. Press Extract to process."
- **Extraction**: "[N] expense(s) extracted. Review and press Save to confirm."
- **Save Success**: "N expense(s) saved successfully. Total: RM [amount]."
- **Feedback**: Click sounds for actions, success sound for saving

## Usage Examples

### Basic Announcement
```javascript
import { useAudioFeedback } from '@/hooks/useAudioFeedback';

export default function MyComponent() {
  const { announce } = useAudioFeedback();

  const handleAction = async () => {
    await announce('Action completed successfully', null, { rate: 0.95 });
  };

  return <button onClick={handleAction}>Click me</button>;
}
```

### Success Feedback with Sound
```javascript
const { announceSuccess } = useAudioFeedback();

const handleSave = async () => {
  // Save logic...
  await announceSuccess('Data saved successfully!');
};
```

### Click Action
```javascript
const { announceClick } = useAudioFeedback();

const handleButtonClick = async () => {
  await announceClick('Opening menu');
  // Navigate or open modal
};
```

### Combined Sound + Speech
```javascript
const { announce } = useAudioFeedback();

const handleWarning = async () => {
  await announce(
    'This action cannot be undone', 
    'WARNING',
    { rate: 0.9 }
  );
};
```

## Accessibility Features

### ARIA Live Regions
All pages include `aria-live="polite"` regions for screen reader users:
```javascript
<div aria-live="polite" role="status" className="sr-only">
  Important status update
</div>
```

### Button Focus Announcements
Interactive buttons announce their purpose on focus:
```javascript
<button onFocus={() => announceNavigation('Button description')}>
  Action
</button>
```

### Keyboard Navigation
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Arrow Keys**: Navigate grids or lists
- **Escape**: Go back or cancel actions

## Customization

### Adjust Speech Rate
```javascript
await announce('Text', null, { rate: 0.8 }); // Slower (0.5-2.0)
```

### Adjust Speech Pitch
```javascript
await announce('Text', null, { pitch: 1.5 }); // Higher pitch
```

### Adjust Volume
```javascript
await announce('Text', null, { volume: 0.5 }); // Quieter
```

### Select Voice
```javascript
const voices = getAvailableVoices();
await announce('Text', null, { voiceIndex: 0 }); // First available voice
```

## Browser Compatibility

- **Chrome/Edge**: Full support (Web Audio API + Web Speech API)
- **Firefox**: Full support
- **Safari**: Partial support (Web Speech API supported, Web Audio API for sounds)
- **Mobile Browsers**: Full support on iOS and Android

## Performance Considerations

1. **AudioContext Initialization**: Lazy-loaded on first user interaction (browser autoplay policy)
2. **Speech Synthesis**: Automatically cancels previous utterances before speaking new ones
3. **Memory**: Audio buffers are generated on-the-fly and garbage collected
4. **Network**: No external dependencies - all TTS uses browser's built-in speech synthesis

## Testing Audio Feedback

### Enable Console Logging
The system includes error logging for debugging:
```javascript
// Check browser console for TTS initialization and errors
window.speechSynthesis
window.AudioContext
```

### Manual Testing Checklist
- [ ] Page loads with proper announcements
- [ ] Button focus provides helpful descriptions
- [ ] Success actions play success sounds
- [ ] Errors announce error sounds and messages
- [ ] Keyboard shortcuts work as announced
- [ ] Speech can be stopped with `announceStop()`
- [ ] Volume is comfortable on different devices

## Future Enhancements

Potential improvements to the audio system:
1. Audio settings page (volume control, voice selection, TTS speed)
2. Custom sound profiles (different sound packs)
3. Audio cues for form field validation
4. Haptic feedback integration (vibration patterns)
5. Offline TTS support (progressive enhancement)
6. Multi-language support (currently en-MY, can extend to more)

## Troubleshooting

### Speech not playing
1. Check browser permission for microphone/audio
2. Ensure AudioContext is initialized (click on page first)
3. Check browser console for errors
4. Try different browser if issue persists

### Sound effects not working
1. Ensure audio volume is not muted system-wide
2. Check browser allows Web Audio API
3. Verify AudioContext initialization

### Slow speech
1. Reduce `rate` parameter (default 0.95)
2. Check system speech synthesis quality settings
3. Try different voice if available

## File Structure

```
src/
├── utils/
│   ├── audioFeedback.js          # Core audio utilities
│   └── financeAccessibility.js   # Finance-specific parsing + speakText export
├── hooks/
│   └── useAudioFeedback.js       # React hook for audio
└── pages/
    ├── LoginPage.jsx             # ✅ Audio feedback added
    ├── HomePage.jsx              # ✅ Audio feedback added
    ├── LogExpensePage.jsx        # ✅ Audio feedback added
    ├── ConfirmPage.jsx           # ✅ Audio feedback added
    ├── HistoryPage.jsx           # ✅ Audio feedback added
    ├── SummaryPage.jsx           # ✅ Audio feedback added
    └── ExtractPage.jsx           # ✅ Audio feedback added
```

## References

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WCAG 2.1 Audio Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

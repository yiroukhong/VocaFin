# Quick Start: Audio Feedback for VocaFin

## For Developers Adding Audio to New Features

### 1. Import the Hook
```javascript
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
```

### 2. Use in Your Component
```javascript
export default function MyComponent() {
  const { announce, announceSuccess, announceError, announceClick } = useAudioFeedback();

  // Use it!
}
```

### 3. Common Scenarios

#### Announce Page Load
```javascript
useEffect(() => {
  const announcePageLoad = async () => {
    await announce('Page description. Available actions: action1, action2.', null, { rate: 0.9 });
  };
  announcePageLoad();
}, [announce]);
```

#### Success Action
```javascript
const handleSave = async () => {
  // Do something...
  await announceSuccess('Data saved successfully!');
};
```

#### Error Handling
```javascript
const handleError = async () => {
  await announceError('Something went wrong. Please try again.');
};
```

#### Button Click with Sound
```javascript
const handleNavigate = async () => {
  await announceClick('Opening history page');
  navigate('/history');
};
```

#### Button Focus Description
```javascript
<button onFocus={() => announceNavigation('Save button. Saves your changes.')}>
  Save
</button>
```

## Available Methods

```javascript
const {
  // Announce with optional sound effect
  announce(text, soundType, options),
  
  // Announce success action
  announceSuccess(text),
  
  // Announce error
  announceError(text),
  
  // Quick click feedback
  announceClick(text),
  
  // Navigation between pages
  announceNavigation(text),
  
  // General information
  announceInfo(text),
  
  // Warning messages
  announceWarning(text),
  
  // Play sound only (no speech)
  playSound(soundType),
  
  // Stop current speech
  stop(),
  
  // Low-level access
  audioContext  // AudioContext object for custom sounds
} = useAudioFeedback();
```

## Sound Types
- `'success'` - Ascending tones (good for confirmations)
- `'error'` - Warning tones (bad news)
- `'click'` - Quick feedback sound
- `'navigation'` - Page transition sound
- `'info'` - Information tone
- `'warning'` - Alert pattern

## Speech Options
```javascript
await announce('Text', soundType, {
  rate: 0.95,        // Speech speed (0.5-2.0)
  pitch: 1.0,        // Voice pitch (0.5-2.0)
  volume: 0.8,       // Volume (0-1)
  lang: 'en-MY',     // Language
  voiceIndex: null   // Specific voice index
});
```

## Accessibility Best Practices

### ✅ DO
- Announce what's happening (loading, saving, error)
- Provide button descriptions on focus
- Announce page purpose on load
- Use consistent sound effects for consistent actions
- Test with actual screen readers
- Include ARIA live regions

### ❌ DON'T
- Spam announcements
- Use sounds without speech explanation
- Forget to stop speech on page transition
- Make sounds too loud or jarring
- Announce every keystroke
- Use technical jargon

## Examples from VocaFin

### HomePage Load
```javascript
const budgetInfo = `Remaining budget: ${remainingBudget.toFixed(2)} ringgit...`;
const navigationHelp = 'Four buttons available: Extract, History, Summary, Voice...';
await announce(`${budgetInfo} ${navigationHelp}`, null, { rate: 0.9 });
```

### LogExpensePage Recording
```javascript
const beginListening = useCallback(async () => {
  setStage('listening');
  startListening();
  await announceClick('Recording. Speak now.');
}, [announceClick, startListening]);
```

### Success Feedback
```javascript
const handleSave = useCallback(async () => {
  // Save logic...
  await announceSuccess(`Expense saved! ${amount} for ${category}.`);
}, [announceSuccess]);
```

## Testing Your Audio

### Manual Testing
1. Click on page (initializes AudioContext)
2. Open browser DevTools Console
3. Check for any errors
4. Test speech and sounds
5. Verify volume levels

### Keyboard Testing
- Use Tab to navigate buttons
- Test all focus descriptions
- Ensure keyboard shortcuts are announced

### Screen Reader Testing
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

## Common Issues & Fixes

### Speech not playing
```javascript
// Fix: Ensure AudioContext initialized (add click handler)
window.addEventListener('click', () => {
  new AudioContext();
}, { once: true });
```

### Sound effects not working
```javascript
// Fix: Check AudioContext is available
if (audioContext) {
  playSoundEffect('success', audioContext);
}
```

### Slow speech
```javascript
// Fix: Increase rate
await announce('Text', null, { rate: 1.2 }); // Faster
```

### Too quiet
```javascript
// Fix: Increase volume
await announce('Text', null, { volume: 1.0 }); // Max
```

## Files Modified
- `src/utils/audioFeedback.js` - Core audio system
- `src/hooks/useAudioFeedback.js` - React hook
- `src/utils/financeAccessibility.js` - Add speakText export
- `src/pages/LoginPage.jsx` - Login audio
- `src/pages/HomePage.jsx` - Home page audio
- `src/pages/LogExpensePage.jsx` - Voice logger audio
- `src/pages/ConfirmPage.jsx` - Confirmation audio
- `src/pages/HistoryPage.jsx` - History page audio
- `src/pages/SummaryPage.jsx` - Summary page audio
- `src/pages/ExtractPage.jsx` - Extract page audio

## Further Reading
See `AUDIO_FEEDBACK_GUIDE.md` for detailed documentation and advanced usage.

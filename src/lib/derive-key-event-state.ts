import { KeyboardEvent } from 'react'

/**
 * Returns an object with several booleans. The booleans describe the state of
 * the `keyboardEvent` passed in as the single argument to this function. The
 * booleans returned can be used to add custom keyboard interaction to an
 * element within a `keydown` or `keypress` listener.
 */
function deriveKeyEventState(keyboardEvent: KeyboardEvent) {
  const { key, shiftKey } = keyboardEvent

  // Arrow keys
  const isArrowDown = key === 'ArrowDown'
  const isArrowLeft = key === 'ArrowLeft'
  const isArrowRight = key === 'ArrowRight'
  const isArrowUp = key === 'ArrowUp'

  // Escape, Space, and Enter
  const isEscape = key === 'Escape'
  const isSpace = key === ' '

  // Tab, Shift+Tab
  const isShiftTab = shiftKey && key === 'Tab'
  const isTab = !shiftKey && key === 'Tab'

  return {
    isArrowDown,
    isArrowLeft,
    isArrowRight,
    isArrowUp,
    isEscape,
    isShiftTab,
    isSpace,
    isTab,
  }
}

export default deriveKeyEventState

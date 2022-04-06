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
  const isArrowDownKey = key === 'ArrowDown'
  const isArrowLeftKey = key === 'ArrowLeft'
  const isArrowRightKey = key === 'ArrowRight'
  const isArrowUpKey = key === 'ArrowUp'

  // Escape, Space, Enter
  const isEscapeKey = key === 'Escape'
  const isSpaceKey = key === ' '

  // Home, End, PageUp, PageDown
  const isHomeKey = key === 'Home'
  const isEndKey = key === 'End'
  const isPageUpKey = key === 'PageUp'
  const isPageDownKey = key === 'PageDown'

  // Tab, Shift+Tab
  const isShiftTabKey = shiftKey && key === 'Tab'
  const isTabKey = !shiftKey && key === 'Tab'

  return {
    isArrowDownKey,
    isArrowLeftKey,
    isArrowRightKey,
    isArrowUpKey,
    isEndKey,
    isEscapeKey,
    isHomeKey,
    isPageDownKey,
    isPageUpKey,
    isShiftTabKey,
    isSpaceKey,
    isTabKey,
  }
}

export default deriveKeyEventState

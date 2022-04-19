import { KeyboardEvent } from 'react'
import deriveKeyEventState from 'lib/derive-key-event-state'

/**
 * Given the key just pressed,
 * the current tab index, and the total tab count,
 *
 * Return the new index that should result
 * from pressing the key in question.
 *
 * Implements the following keyboard interactions:
 * - `ArrowRight` moves the focus to the next tab
 *    If focus is on the last tab, moves focus to the first tab.
 * - `ArrowLeft` moves the focus to the previous tab
 *    If focus is on the first tab, moves focus to the last tab.
 *
 * Keyboard interaction reference:
 * https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-21
 * And example based on that reference:
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tablist_Role#keyboard_interactions
 *
 * Note that "Home" and "End" are suggested as optional mechanisms to quickly
 * navigate to the first or last tab, respectively. Our intent in this
 * implementation is to retain the scrolling functionality of those keys.
 */
function newIndexFromKeypress(
  e: KeyboardEvent,
  currentIndex: number,
  tabsCount: number
): number {
  const { isArrowRightKey, isArrowLeftKey } = deriveKeyEventState(e)
  const isFirstTab = currentIndex === 0
  const isLastTab = currentIndex === tabsCount - 1

  // Move focus to first tab
  if (isArrowRightKey && isLastTab) {
    return 0
  }

  // Move focus to next tab
  if (isArrowRightKey && !isLastTab) {
    return currentIndex + 1
  }

  // Move focus to last tab
  if (isArrowLeftKey && isFirstTab) {
    return tabsCount - 1
  }

  // Move focus to previous tab
  if (isArrowLeftKey && !isFirstTab) {
    return currentIndex - 1
  }

  // Do not move focus
  return currentIndex
}

export default newIndexFromKeypress

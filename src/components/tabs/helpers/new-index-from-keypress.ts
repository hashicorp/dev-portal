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
  key: string,
  currentIndex: number,
  tabsCount: number
): number {
  if (key == 'ArrowRight') {
    // Move right
    const nextIndex = currentIndex + 1
    if (nextIndex >= tabsCount) {
      // If we're at the end, move to the start
      return 0
    } else {
      return nextIndex
    }
  } else if (key == 'ArrowLeft') {
    // Move left
    const previousIndex = currentIndex - 1
    if (previousIndex < 0) {
      // If we're at the start, move to the end
      return tabsCount - 1
    } else {
      return previousIndex
    }
  } else {
    // No movement
    return currentIndex
  }
}

export default newIndexFromKeypress

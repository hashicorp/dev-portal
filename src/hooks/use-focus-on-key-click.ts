import { useEffect, MutableRefObject } from 'react'

/**
 * Attempts to focus the provided ref when the passed key is pressed.
 * Will no-op if focus is already in an input element.
 */
export default function useFocusOnKeyClick(
  ref: MutableRefObject<HTMLElement>,
  key: string
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const eventTarget = e.target as HTMLElement
      const tagName = eventTarget.tagName
      if (
        eventTarget.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'SELECT' ||
        tagName === 'TEXTAREA'
      ) {
        // Already in an input
        return
      }

      // Bind to the `/` key
      if (e.key !== key) {
        return
      }

      ref.current?.focus()
      e.stopPropagation()
      e.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref is a ref object, no need to be in dep array
  }, [key])
}

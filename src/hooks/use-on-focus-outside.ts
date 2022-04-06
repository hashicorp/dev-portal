import { MutableRefObject, useEffect } from 'react'

/**
 * Hook that runs a callback on focus outside the ref
 */
export default function useOnFocusOutside(
  refs: MutableRefObject<HTMLElement>[],
  handler: (event?: FocusEvent) => void,
  shouldListen: boolean = true
) {
  useEffect(() => {
    const listener = (event: FocusEvent) => {
      // See if any provided refs had a focus event inside of them
      const isFocusInside = refs.some((ref: MutableRefObject<HTMLElement>) =>
        ref?.current?.contains(event.target as Node)
      )

      // Do nothing if the focus was inside any provided ref or its descendants
      if (isFocusInside) {
        return
      }

      // Invoke handler if the focus was outside all provided refs
      handler(event)
    }

    // Listen for `focusin` events if `shouldListen` is true
    if (shouldListen) {
      document.addEventListener('focusin', listener)
    }

    // Remove listener upon unmounting
    return () => {
      document.removeEventListener('focusin', listener)
    }
  }, [refs, handler, shouldListen])
}

import { MutableRefObject, useEffect } from 'react'

/**
 * Given an array of ref objects and a callback handler, invokes the handler if
 * a `focusin` event does not occur inside of any of the ref objects.
 *
 * Listens for `focusin` events by default, but this can be disabled by passing
 * `false` for the `shouldListen` parameter.
 *
 * Note: `shouldListen` is particularly useful when this hook is used in
 * components that manage an open/closed state. Passing `false` for
 * `shouldListen` when these types of components are in a closed state, and
 * `focusin` events don't need to be listened to, prevents adding
 * unnecessary event listeners to the document.
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

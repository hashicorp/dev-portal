import { MutableRefObject, useEffect } from 'react'

export default function useOnClickOutside(
  refs: MutableRefObject<HTMLElement>[],
  handler: (event?: MouseEvent | TouchEvent) => void,
  shouldListen: boolean = true
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // See if any provided refs had a click inside of them
      const isClickInside = refs.some((ref: MutableRefObject<HTMLElement>) =>
        ref?.current?.contains(event.target as Node)
      )

      // Do nothing if the click was inside any provided ref or its descendants
      if (isClickInside) {
        return
      }

      // Invoke handler if the click was outside all provided refs
      handler(event)
    }

    // Listen for pointer events if `shouldListen` is true
    if (shouldListen) {
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
    }

    // Remove listeners upon unmounting
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler, shouldListen])
}

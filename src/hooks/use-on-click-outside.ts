import { useEffect } from 'react'

export default function useOnClickOutside(refs, handler, shouldListen = true) {
  useEffect(() => {
    const listener = (event) => {
      // See if any provided refs had a click inside of them
      const isClickInside = refs.some((ref) =>
        ref?.current?.contains(event.target)
      )

      // Do nothing if the click was inside any provided ref or its descendants
      if (isClickInside) {
        return
      }

      // Invoke handler if the click was outside all provided refs
      handler(event)
    }

    // listen for touchstart or click events; but only when this dropdown is active via shouldListen
    if (shouldListen) {
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
    }

    // remove listeners upon unmounting
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler, shouldListen])
}

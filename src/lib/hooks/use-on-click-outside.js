import { useEffect } from 'react'

export default function useOnClickOutsideDropdown(
  refs,
  handler,
  shouldListen = true
) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      const isClickInside = refs.reduce((acc, ref) => {
        return acc || !ref.current || ref.current.contains(event.target)
      }, false)
      if (isClickInside) return
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

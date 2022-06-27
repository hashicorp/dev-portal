import { MutableRefObject, useState } from 'react'
import useSafeLayoutEffect from './use-safe-layout-effect'

/**
 * Determines whether the given ref is too wide for its parent container.
 */
export default function useHasOverflow<T extends HTMLElement>(
  ref: MutableRefObject<T>
) {
  // Initialized to `null` to work like a "loading" state
  const [hasOverflow, setHasOverflow] = useState(null)

  // `useLayoutEffect` blocks updates, to prevent flashing
  useSafeLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const resizeListener = () => {
      // get the element and its parent from the ref
      const element = ref.current
      const parentElement = element.parentElement

      // get the widths we need to compare
      const availableWidth = parentElement.offsetWidth
      const actualWidth = element.scrollWidth

      // update `hasOverflow`
      setHasOverflow(actualWidth > availableWidth)
    }

    // invoke the listener on first load
    resizeListener()

    // add the listener to the document
    window.addEventListener('resize', resizeListener)

    // remove listener in cleanup phase
    return () => window.removeEventListener('resize', resizeListener)
  }, [])

  return hasOverflow
}

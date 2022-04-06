import { useEffect } from 'react'

/**
 * Hook that runs a callback on focus outside the ref
 */
function useOnFocusOutside(refs, handler, shouldListen = true) {
  useEffect(() => {
    function handleFocusChange(event) {
      const isFocusInside = refs.some((ref) =>
        ref?.current?.contains(event.target as Node)
      )
      if (isFocusInside) {
        return
      }
      handler(event)
    }

    // Bind the event listener
    if (shouldListen) {
      document.addEventListener('focusin', handleFocusChange)
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [refs, handler, shouldListen])
}

export default useOnFocusOutside

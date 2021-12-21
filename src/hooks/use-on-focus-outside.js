import { useEffect } from 'react'

/**
 * Hook that runs a callback on focus outside the ref
 */
function useOnFocusOutside(ref, handler) {
  useEffect(() => {
    function handleFocusChange(event) {
      const isOutside = ref.current && !ref.current.contains(event.target)
      if (isOutside) handler(event)
    }

    // Bind the event listener
    document.addEventListener('focusin', handleFocusChange)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [ref, handler])
}

export default useOnFocusOutside

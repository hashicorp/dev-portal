import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * Attempts to preload the resources for a next/dynamic instance during idle time. Can be used in conjunction
 * with next/dynamic to preload components which are expected to be needed in near-term interactions.
 *
 * @param dynamicDefinition A dynamic component created with next/dynamic
 * @returns a boolean indicating whether or not the component is preloaded
 */
const usePreloadNextDynamic = (
  dynamicDefinition: ReturnType<typeof dynamic>
) => {
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    if (isPreloaded) {
      return
    }

    const load = () => {
      // @ts-expect-error - this dose not exist on next/dynamic's type, but it is there!
      dynamicDefinition.render
        .preload()
        .then(() => {
          setIsPreloaded(true)
        })
        .catch(() => {
          // do nothing, non-critical failure
        })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => load(), { timeout: 5000 })
    } else {
      // wait a tick to let other work take priority
      setTimeout(() => load(), 0)
    }
  }, [dynamicDefinition, isPreloaded])

  return isPreloaded
}

export default usePreloadNextDynamic

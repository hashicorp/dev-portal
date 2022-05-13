import { useEffect } from 'react'

const SCROLL_PERCENTAGE_THRESHOLDS = [25, 50, 75, 90]

// TODO: do we care about this potentially updating?
const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0

const getPercentageScrolled = (documentHeight) => {
  const scrollOffset = window.scrollY + windowHeight

  return Math.round(scrollOffset / documentHeight) * 100
}

export default function useScrollPercentageAnalytics() {
  useEffect(() => {
    if (!window?.analytics?.track) {
      return
    }

    function setupScrollPercentageTracking() {
      const thresholdsRemaining = [...SCROLL_PERCENTAGE_THRESHOLDS]
      const documentHeight = document.documentElement.scrollHeight
      let furthestPercentageScrolled = 0

      function scrollEventHandler() {
        if (!thresholdsRemaining) {
          window.removeEventListener('scroll', scrollEventHandler)
          return
        }

        window.requestAnimationFrame(() => {
          const percentageScrolled = getPercentageScrolled(documentHeight)

          if (percentageScrolled < furthestPercentageScrolled) {
            return
          }

          furthestPercentageScrolled = percentageScrolled

          while (percentageScrolled >= thresholdsRemaining[0]) {
            const percent = thresholdsRemaining.shift()

            window.analytics.track('Percentage Scrolled', {
              percent,
            })
          }
        })
      }

      window.addEventListener('scroll', scrollEventHandler, { passive: true })

      return () => window.removeEventListener('scroll', scrollEventHandler)
    }

    const cleanup = setupScrollPercentageTracking()

    return () => {
      cleanup()
    }
  }, [])
}

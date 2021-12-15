import { useEffect, useRef, useState } from 'react'
import { SidecarHeading } from './types'

/**
 * This code comes from one of Bryce's (@BRKalow) @hashicorp/react-components PRs:
 * https://github.com/hashicorp/react-components/pull/325
 */
export function useActiveSection(
  sections: SidecarHeading[],
  isEnabled = true
): string {
  const [activeSection, setActiveSection] = useState<string>()
  const previousY = useRef<number>()

  const findMatchingSectionIndex = (slug: string) => {
    return sections.findIndex((section) => section.slug === slug)
  }

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let currentY: number
        let scrollTrend: 'down' | 'up'
        const visibleHeadings = []

        entries.forEach((entry) => {
          currentY = window.scrollY
          scrollTrend = previousY.current < currentY ? 'down' : 'up'

          if (entry.isIntersecting) {
            visibleHeadings.push(entry.target.id)
          }
        })

        const isSingleEntryLeaving =
          entries.length === 1 && !entries[0].isIntersecting
        const singleEntryLeavingIndex = isSingleEntryLeaving
          ? findMatchingSectionIndex(entries[0].target.id)
          : -1

        // Activate only the bottom-most visible section heading
        if (visibleHeadings.length === 1) {
          setActiveSection(visibleHeadings[0])
        } else if (visibleHeadings.length > 1) {
          setActiveSection(visibleHeadings[visibleHeadings.length - 1])
        }

        if (previousY.current) {
          // If we detect that we're scrolling up, and there are no visible headers,
          // optimistically set the previous header as visible to make the active section match the visible content
          if (visibleHeadings.length === 0 && scrollTrend === 'up') {
            setActiveSection((current) => {
              const curActiveIndex = findMatchingSectionIndex(current)

              // Handle an ege case where we get an intersection event for a heading further down the page
              // leaving intersection, otherwise this would cause the active heading to incorrectly get bumped up
              if (
                isSingleEntryLeaving &&
                singleEntryLeavingIndex > curActiveIndex
              )
                return current

              const newIndex = curActiveIndex - 1

              if (newIndex < 0) return current

              return sections[newIndex].slug
            })
          }
        }
        if (currentY) previousY.current = currentY
      },
      { rootMargin: '0% 0% -75% 0%' }
    )

    sections.forEach((section) => {
      const el = document.querySelector(`#${section.slug}`)
      if (el) observer.observe(el)
    })

    return () => {
      sections.forEach((section) => {
        const el = document.querySelector(`#${section.slug}`)
        if (el) observer.unobserve(el)
      })
    }
  }, [isEnabled])

  return activeSection
}

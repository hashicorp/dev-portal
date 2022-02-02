import { useEffect, useRef, useState } from 'react'
import { SidecarHeading } from './types'
import getCSSVariableFromDocument from 'lib/get-css-variable-from-document'

/**
 * The sticky header has a specific height and we care about headings that are
 * visible below it. This function calculates the height of the header based on
 * two CSS variables.
 *
 * TODO: this may need to be refactored when we address the brittleness of our
 * header height.
 */
const getFullNavHeaderHeight = () => {
  const navigationHeaderHeight = getCSSVariableFromDocument(
    '--navigation-header-height',
    { asNumber: true }
  ) as number
  const alertBarHeight = getCSSVariableFromDocument('--alert-bar-height', {
    asNumber: true,
  }) as number

  return navigationHeaderHeight + alertBarHeight
}

/**
 * This code started based off of one of Bryce's (@BRKalow) PRs in the
 * @hashicorp/react-components repo:
 * https://github.com/hashicorp/react-components/pull/325
 */
export function useActiveSection(
  headings: SidecarHeading[],
  isEnabled = true
): string {
  const visibleHeadings = useRef<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<SidecarHeading['slug']>()
  const previousY = useRef<number>()

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    const findMatchingSectionIndex = (slug: string) => {
      return headings.findIndex((section) => section.slug === slug)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let currentY: number
        let scrollTrend: 'down' | 'up'

        entries.forEach((entry) => {
          const entryId = entry.target.id
          currentY = window.scrollY
          scrollTrend = previousY.current < currentY ? 'down' : 'up'

          if (entry.isIntersecting) {
            visibleHeadings.current[entryId] = entry.target
          } else {
            delete visibleHeadings.current[entryId]
          }
        })

        const isSingleEntryLeaving =
          entries.length === 1 && !entries[0].isIntersecting
        const singleEntryLeavingIndex = isSingleEntryLeaving
          ? findMatchingSectionIndex(entries[0].target.id)
          : -1

        // Find the heading closest to the top
        const visibleHeadingIds = Object.keys(visibleHeadings.current)
        if (visibleHeadingIds.length > 0) {
          let shortestDistance
          let closestHeading
          visibleHeadingIds.forEach((headingId) => {
            const headingEntry = visibleHeadings.current[headingId]
            const distance = headingEntry.getBoundingClientRect().bottom
            if (!closestHeading || distance < shortestDistance) {
              closestHeading = headingId
              shortestDistance = distance
            }
          })
          setActiveSection(closestHeading)
        } else if (previousY.current) {
          // If we detect that we're scrolling up, and there are no visible
          // headers, optimistically set the previous header as visible to make
          // the active section match the visible content
          if (visibleHeadingIds.length === 0 && scrollTrend === 'up') {
            setActiveSection((current) => {
              const curActiveIndex = findMatchingSectionIndex(current)

              // Handle an ege case where we get an intersection event for a
              // heading further down the page leaving intersection, otherwise
              // this would cause the active heading to incorrectly get bumped
              // up
              if (
                isSingleEntryLeaving &&
                singleEntryLeavingIndex > curActiveIndex
              ) {
                return current
              }

              const newIndex = curActiveIndex - 1

              if (newIndex < 0) {
                return current
              }

              return headings[newIndex].slug
            })
          }
        }

        if (currentY) {
          previousY.current = currentY
        }
      },
      { rootMargin: `-${getFullNavHeaderHeight()}px 0% -50% 0%`, threshold: 1 }
    )

    headings.forEach((section) => {
      const el = document
        .getElementById('main')
        .querySelector(`#${section.slug}`)
      if (el) observer.observe(el)
    })

    return () => {
      headings.forEach((section) => {
        const el = document
          .getElementById('main')
          .querySelector(`#${section.slug}`)
        if (el) observer.unobserve(el)
      })
    }
  }, [headings, isEnabled])

  return activeSection
}

import { useEffect, useRef, useState } from 'react'
import { TableOfContentsHeading } from './types'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'

/**
 * This code started based off of one of Bryce's (@BRKalow) PRs in the
 * @hashicorp/react-components repo:
 * https://github.com/hashicorp/react-components/pull/325
 */
export function useActiveSection(
	headings: TableOfContentsHeading[],
	isEnabled = true
): string {
	const visibleHeadings = useRef<Set<string>>(new Set())
	const [activeSection, setActiveSection] =
		useState<TableOfContentsHeading['slug']>()
	const previousY = useRef<number>()

	// isProductLanding is needed to determine the IntersectionObserver threshold
	// because the headings on product landing pages are smaller than the on docs
	// pages
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const currentProduct = useCurrentProduct()
	const isProductLanding =
		currentProduct && currentPath === `/${currentProduct.slug}`

	useEffect(() => {
		// Need to clear this when all headings change
		visibleHeadings.current = new Set()

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
					currentY = window.scrollY
					scrollTrend = previousY.current < currentY ? 'down' : 'up'

					const entryId = entry.target.id
					if (entry.isIntersecting) {
						visibleHeadings.current.add(entryId)
					} else {
						visibleHeadings.current.delete(entryId)
					}
				})

				const isSingleEntryLeaving =
					entries.length === 1 && !entries[0].isIntersecting
				const singleEntryLeavingIndex = isSingleEntryLeaving
					? findMatchingSectionIndex(entries[0].target.id)
					: -1

				if (visibleHeadings.current.size > 0) {
					// Find the heading closest to the top of the viewport
					let shortestDistance
					let closestHeading
					visibleHeadings.current.forEach((headingId) => {
						const targetElement = document.getElementById(headingId)
						const distance = targetElement.getBoundingClientRect().bottom
						if (!closestHeading || distance < shortestDistance) {
							closestHeading = headingId
							shortestDistance = distance
						}
					})
					setActiveSection(closestHeading)
				} else if (previousY.current && scrollTrend === 'up') {
					// If we detect that we're scrolling up, and there are no visible
					// headers, optimistically set the previous header as visible to make
					// the active section match the visible content
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

				if (currentY) {
					previousY.current = currentY
				}
			},
			{
				rootMargin: `-${getFullNavHeaderHeight()}px 0% -40% 0%`,
				threshold: isProductLanding ? 0 : 1,
			}
		)

		headings.forEach((section) => {
			const el = document
				.getElementById('main')
				?.querySelector(`#${CSS.escape(section.slug)}`)
			if (el) {
				observer.observe(el)
			}
		})

		return () => {
			observer.disconnect()
		}
	}, [headings, isEnabled, isProductLanding])

	return activeSection
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useRef, useState } from 'react'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'

/**
 * This code started based off of one of Bryce's (@BRKalow) PRs in the
 * @hashicorp/react-components repo:
 * https://github.com/hashicorp/react-components/pull/325
 */
export function useActiveSection(
	slugs: string[],
	isEnabled: boolean = true,
	defaultSection?: string
): string {
	const visibleHeadings = useRef<Set<string>>(new Set())
	const [activeSection, setActiveSection] = useState<string>(defaultSection)
	const previousY = useRef<number>()

	/**
	 * isProductLanding is needed to determine the IntersectionObserver threshold
	 * because the headings on product landing pages are smaller than the on docs
	 * pages
	 *
	 * TODO: consider extracting this as a more generic option?
	 * For example, support an optional `observerThreshold` argument, default 1?
	 * And pass the option in when using this component on product landing pages?
	 *
	 * Alternately, this may no longer be an issue if the differences on the
	 * product landing page are resolved, which is in-progress in dev-portal#1634.
	 */
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

		/**
		 * Given a heading `#id`, match it to an incoming `#slug` hash URL.
		 *
		 * Normally this would be very straightforward, `id` and `slug` would match.
		 * However, some headings are in sanitized user content, so while our links
		 * use the `#slug` URL, at the DOM level the heading `id`s have been
		 * sanitized to `user-content-<slug>`.
		 *
		 * We need to account for this when matching observed element `id` values
		 * to the list of `slug` strings passed to this hook.
		 */
		const findMatchingSectionSlug = (id: string) => {
			return slugs.find((s) => s === id || `user-content-${s}` === id)
		}

		const findMatchingSectionIndex = (headingId: string) => {
			const matchedSlug = findMatchingSectionSlug(headingId)
			return slugs.findIndex((s) => s === matchedSlug)
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
					const activeSectionSlug = findMatchingSectionSlug(closestHeading)
					setActiveSection(activeSectionSlug)
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

						return slugs[newIndex]
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

		slugs.forEach((s) => {
			/**
			 * Some headings are in sanitized user content, so while our links
			 * use the `#slug` link, at the DOM level the heading `id`s have been
			 * sanitized to `user-content-<slug>`.
			 *
			 * We need to account for this when finding elements to observe by `id`.
			 */
			const userSlug = `user-content-${s}`
			const el = document.getElementById(s) || document.getElementById(userSlug)

			if (el) {
				observer.observe(el)
			}
		})

		return () => {
			observer.disconnect()
		}
	}, [slugs, isEnabled, isProductLanding])

	return activeSection
}

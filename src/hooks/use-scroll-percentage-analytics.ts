/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { canTrackAnalytics } from 'lib/analytics'

const SCROLL_PERCENTAGE_THRESHOLDS = [25, 50, 75, 90]

const getPercentageScrolled = (documentHeight, windowHeight) => {
	const scrollOffset = window.scrollY + windowHeight

	return Math.round((scrollOffset / documentHeight) * 100)
}

/**
 * Track scroll percentages for any given page, per the analytics spec here: /analytics/spec/events/page_scrolled.yaml
 */
export default function useScrollPercentageAnalytics() {
	useEffect(() => {
		if (!canTrackAnalytics()) {
			return
		}

		function setupScrollPercentageTracking() {
			const thresholdsRemaining = [...SCROLL_PERCENTAGE_THRESHOLDS]
			// Only read this value once as it causes a synchronous style / layout calc
			// ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
			const documentHeight = document.documentElement.scrollHeight
			const windowHeight =
				typeof window !== 'undefined' ? window.innerHeight : 0
			let furthestPercentageScrolled = 0

			function scrollEventHandler() {
				// Remove the scroll listener if we've tracked all of our desired percentages.
				if (thresholdsRemaining.length === 0) {
					window.removeEventListener('scroll', scrollEventHandler)
					return
				}

				window.requestAnimationFrame(() => {
					// Calculating this in requestAnimationFrame as reading the window dimensions cause a synchronous style / layout calc
					// ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
					const percentageScrolled = getPercentageScrolled(
						documentHeight,
						windowHeight
					)

					if (percentageScrolled < furthestPercentageScrolled) {
						return
					}

					furthestPercentageScrolled = percentageScrolled

					while (percentageScrolled >= thresholdsRemaining[0]) {
						const percent = thresholdsRemaining.shift()

						window.analytics.track('Page Scrolled', {
							percent,
						})
					}
				})
			}

			window.addEventListener('scroll', scrollEventHandler, { passive: true })

			return () => window.removeEventListener('scroll', scrollEventHandler)
		}

		const cleanup = setupScrollPercentageTracking()

		return cleanup
	}, [])
}

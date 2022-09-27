import { useEffect, useState } from 'react'

/**
 * TODO: maybe isBrowser() would be a helpful util?
 * Kinda like canUseAnalytics().
 */
const IS_BROWSER = typeof window !== 'undefined'
const SIGNIFICANT_DIGITS = 2

/**
 * Determine the percentage of the page that has been scrolled.
 * TODO: split this out to a separate function,
 * since it's used in an identical way in the adjacent
 * use-scroll-percentage-analytics.ts
 */
const getPercentageScrolled = (
	documentHeight: number,
	windowHeight: number
) => {
	const scrollOffset = window.scrollY + windowHeight
	return (scrollOffset / documentHeight) * 100
}

/**
 * Round a number to the provided significant digits.
 * TODO: move this to utils?
 *
 * @param number
 * @param significantDigits
 */
function round(number: number, significantDigits: number) {
	const roundingFactor = Math.pow(10, significantDigits)
	return Math.round(number * roundingFactor) / roundingFactor
}

type ScrollPercentage = number | null

/**
 * Track the percentage of scrolled distance on the page.
 */
export default function useScrollPercentage(): ScrollPercentage {
	const [percentageScrolled, setPercentageScrolled] =
		useState<ScrollPercentage>(null)

	useEffect(() => {
		if (!IS_BROWSER) {
			return
		}

		function setupScrollPercentageTracking() {
			// Only read this value once as it causes a synchronous style / layout calc
			// ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
			const documentHeight = document.documentElement.scrollHeight
			const windowHeight =
				typeof window !== 'undefined' ? window.innerHeight : 0

			function scrollEventHandler() {
				console.log('Called scroll event handler...')
				window.requestAnimationFrame(() => {
					/**
					 * Note: we calculate this in requestAnimationFrame as reading the
					 * window dimensions causes a synchronous style / layout calc
					 * ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
					 *
					 * Note: we Round to a specific number of decimal places, otherwise we're
					 * dealing with not-really-worth-comparing floating point numbers.
					 */
					const updatedPercentScrolled = round(
						getPercentageScrolled(documentHeight, windowHeight),
						SIGNIFICANT_DIGITS
					)

					/**
					 * TODO: Only update state if rounded scroll percentage has changed
					 * useState has an (prevVal) => nextVal signature I think? use that.
					 */
					setPercentageScrolled(updatedPercentScrolled)
				})
			}

			window.addEventListener('scroll', scrollEventHandler, { passive: true })
			return () => window.removeEventListener('scroll', scrollEventHandler)
		}

		const cleanup = setupScrollPercentageTracking()

		/**
		 * TODO: was not seeing scroll percent update on initial render,
		 * seemed to have to make some scroll movement for the initial update.
		 *
		 * We want an initial update even before scroll movement, I think?
		 * (I think it makes sense to match the scroll heuristic we use
		 * for scroll-progress analytics...)
		 *
		 * The below kinda works... but should maybe use a custom event name?
		 * Firing a "scroll" event seems a little wrong, it's not a
		 * real scroll event, and could cause unexpected behaviour elsewhere
		 * in the app. (But, seemed like a shortcut to get the initial
		 * render to work in a skateboard way.)
		 */
		window.dispatchEvent(new Event('scroll'))

		return cleanup
	}, [])

	return percentageScrolled
}

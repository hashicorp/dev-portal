import { useEffect, useState } from 'react'

/**
 * TODO: maybe isBrowser() would be a helpful util?
 * Kinda like canUseAnalytics().
 */
const IS_BROWSER = typeof window !== 'undefined'
const SIGNIFICANT_DIGITS = 2
const CUSTOM_EVENT_NAME = 'use-scroll-percentage_initial-update'

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
	console.log({ scrollOffset, documentHeight })
	return (scrollOffset / documentHeight) * 100
}

/**
 * Round a number to the provided significant digits.
 * TODO: move this to utils
 *
 * @param number
 * @param significantDigits
 */
function round(number: number, significantDigits: number) {
	const roundingFactor = Math.pow(10, significantDigits)
	return Math.round(number * roundingFactor) / roundingFactor
}

/**
 * Scroll percentage will be `null` on initial load,
 * before we've been able to calculate anything,
 * and will remain `null` if we're not in the browser.
 */
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
			/**
			 * Only read document & window metrics once, as they cause
			 * a synchronous style / layout calc
			 * ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
			 */
			/**
			 * TODO: document height changes after initial load though!
			 * Even without the CUSTOM_EVENT_NAME stuff...
			 * TODO: check if this is the case for
			 * use-scroll-percentage-analytics as well, I think it is?
			 * (Regardless: this relatively minor tradeoff in accuracy is likely
			 * well worth the performance benefit, I think?)
			 *
			 * TODO: this is maybe an issue for client-side navigation?
			 * It seems like the component doesn't fully unmount and remount,
			 * and as a result, when we switch from a tutorial with long
			 * page content to a tutorial with short page content,
			 * we end up seeing less acceptable inaccuracies in scroll percentage
			 * difference. Some possibilities here:
			 * - hook into router, manually fire CUSTOM_EVENT_NAME to update?
			 * - also fire on window 'resize' events maybe? (these can also be a
			 *   source of relatively significant discrepancies)
			 */
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
			window.addEventListener(CUSTOM_EVENT_NAME, scrollEventHandler)
			return () => {
				window.removeEventListener('scroll', scrollEventHandler)
				window.removeEventListener(CUSTOM_EVENT_NAME, scrollEventHandler)
			}
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
		 * The below kinda works... but does the custom event name make sense?
		 * Firing a "scroll" event seems a little wrong, it's not a
		 * real scroll event, and could cause unexpected behaviour elsewhere
		 * in the app.
		 */
		window.dispatchEvent(new Event(CUSTOM_EVENT_NAME))

		return cleanup
	}, [])

	return percentageScrolled
}

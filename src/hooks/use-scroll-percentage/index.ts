import { useEffect, useState } from 'react'
import useWindowSize from 'hooks/use-window-size'
import {
	getPercentageScrolled,
	isBrowser,
	round,
	useDocumentScrollHeight,
} from './helpers'

const SIGNIFICANT_DIGITS = 2
const CUSTOM_EVENT_NAME = 'use-scroll-percentage_initial-update'

/**
 * Scroll percentage will be `undefined` on initial load,
 * before we've been able to calculate anything,
 * and will remain `undefined` if we're not in the browser.
 */
type ScrollPercentage = number | undefined

/**
 * Track the percentage of scrolled distance on the page.
 *
 * Note: this hook accepts an option `mutationTargetSelector` string.
 * If this option is used, and yields a valid element, we attach a mutation
 * observer to that element and monitor the element and its subtree for
 * changes. This ensures better accuracy of the `documentScrollHeight` we
 * use to calculate scroll percentage, as in many views, document height
 * may change significantly through user interactions that update the DOM.
 *
 * For example, on the Tutorial view, the contents in the `main` element
 * frequently change height from interactions such as changing tabbed content.
 * For that view, we pass `main` as the `mutationTargetSelector`.
 */
export default function useScrollPercentage(mutationTargetSelector: string): {
	percentageScrolled: ScrollPercentage
	windowHeight: number
	documentScrollHeight: number
} {
	/**
	 * We use separate effects to monitor document scroll height & window size.
	 * We expect these separate effect to run relatively infrequently:
	 * - window size will change if the window is resized
	 * - document scroll height will change if document contents change,
	 *   or if the window is resized
	 */
	const { height: windowHeight } = useWindowSize()
	const documentScrollHeight = useDocumentScrollHeight(mutationTargetSelector)

	const [percentageScrolled, setPercentageScrolled] =
		useState<ScrollPercentage>()

	useEffect(() => {
		if (!isBrowser()) {
			return
		}

		console.log('Running useScrollPercentage effect...')

		function setupScrollPercentageTracking() {
			function scrollEventHandler() {
				console.log('Called scroll event handler...')
				window.requestAnimationFrame(() => {
					/**
					 * Note: we calculate this in requestAnimationFrame as reading the
					 * window dimensions causes a synchronous style / layout calc
					 * ref: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
					 *
					 * Note: we round to a specific number of decimal places, otherwise we're
					 * dealing with not-really-worth-comparing floating point numbers.
					 */
					const updatedPercentScrolled = round(
						getPercentageScrolled(documentScrollHeight, windowHeight),
						SIGNIFICANT_DIGITS
					)

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
		 *
		 * TODO: might be able to remove this, with new documentScrollHeight
		 * & windowHeight changes.
		 */
		window.dispatchEvent(new Event(CUSTOM_EVENT_NAME))

		return cleanup
	}, [documentScrollHeight, windowHeight])

	return {
		percentageScrolled,
		windowHeight,
		documentScrollHeight,
	}
}

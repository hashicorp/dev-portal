import { useEffect, useState } from 'react'
import useWindowSize from 'hooks/use-window-size'
import {
	getPercentageScrolled,
	isBrowser,
	round,
	useDocumentScrollHeight,
} from './helpers'

const DECIMAL_PRECISION = 2
const CUSTOM_INITIAL_EVENT_NAME = 'use-scroll-percentage_initial-update'

/**
 * Track the percentage of scrolled distance on the page.
 *
 * Note: the return value will be `undefined` before the first calculation
 * of scroll percentage.
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
export default function useScrollPercentage({
	mutationTargetSelector,
	excludeViewportHeight,
}: {
	mutationTargetSelector?: string
	excludeViewportHeight?: boolean
} = {}): number | undefined {
	/**
	 * We use separate effects to monitor document scroll height & window size.
	 * We expect these separate effect to run relatively infrequently:
	 * - window size will change if the window is resized
	 * - document scroll height will change if document contents change,
	 *   or if the window is resized
	 */
	const { height: windowHeight } = useWindowSize()
	const documentScrollHeight = useDocumentScrollHeight(mutationTargetSelector)

	const [percentageScrolled, setPercentageScrolled] = useState<number>()

	useEffect(() => {
		/**
		 * No point in trying to run this effect in SSR.
		 */
		if (!isBrowser()) {
			return
		}

		function setupScrollPercentageTracking() {
			function scrollEventHandler() {
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
						getPercentageScrolled(
							documentScrollHeight,
							windowHeight,
							excludeViewportHeight
						),
						DECIMAL_PRECISION
					)

					setPercentageScrolled(updatedPercentScrolled)
				})
			}

			window.addEventListener('scroll', scrollEventHandler, { passive: true })
			window.addEventListener(CUSTOM_INITIAL_EVENT_NAME, scrollEventHandler)
			return () => {
				window.removeEventListener('scroll', scrollEventHandler)
				window.removeEventListener(
					CUSTOM_INITIAL_EVENT_NAME,
					scrollEventHandler
				)
			}
		}

		const cleanup = setupScrollPercentageTracking()

		/**
		 * We want an initial update even before scroll movement,
		 * particularly when `excludeViewportHeight` is `false`,
		 * as otherwise we'll see a big jump when the first `scroll`
		 * event is fired.
		 *
		 * We listen for and dispatch a custom event to ensure we get an initial
		 * update, even before any `scroll` events are fired by scroll movement.
		 */
		window.dispatchEvent(new Event(CUSTOM_INITIAL_EVENT_NAME))

		return cleanup
	}, [documentScrollHeight, windowHeight, excludeViewportHeight])

	return percentageScrolled
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MutableRefObject, useRef, useState } from 'react'
import useSafeLayoutEffect from 'hooks/use-safe-layout-effect'

const MUTATION_OPTS = { attributes: true, childList: true, subtree: true }

/**
 * Overflow is determined by whether the width of a target element’s content is
 * greater than the width of its layout.
 *
 * Overflow is checked on viewport resize and on a target element’s DOM
 * mutation. Both are throttled by animation frame requests.
 *
 * MutationObserver Compatibility:
 * 	- Chrome 26+
 * 	- Edge 12+
 * 	- Firefox 14+
 * 	- Internet Explorer 11+
 * 	- Safari 17+
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export default function useHasOverflow<T extends HTMLElement>(): [
	boolean,
	MutableRefObject<T>
] {
	const overflowTargetRef = useRef<T>(null)
	const smallestWidthBeforeOverflow = useRef<number>(null)
	const [hasOverflow, setHasOverflow] = useState<boolean>(null)

	useSafeLayoutEffect(() => {
		const target = overflowTargetRef.current
		const viewport = target.ownerDocument.defaultView

		let requestId

		/**
		 * Checks whether or not the target element is overflowing its container.
		 * Updates the `hasOverflow` state as needed based on the checks performed.
		 */
		function checkOverflow() {
			requestId = null
			const targetWidth = target.scrollWidth
			const availableWidth = target.offsetWidth

			/**
			 * Capture the smallest width the target can be before it overflows its
			 * parent.
			 */
			if (
				targetWidth > availableWidth &&
				smallestWidthBeforeOverflow.current === null
			) {
				smallestWidthBeforeOverflow.current = targetWidth
			}

			/**
			 * Performing functional updates to the `hasOverflow` local state value.
			 * There is one case where this is necessary, so all conditions that
			 * determine the new value have been grouped here as well.
			 */
			setHasOverflow((previouslyHadOverflow: boolean) => {
				/**
				 * If there is enough available width for the target element, then we
				 * can flip `hasOverflow` to false. The `!== null` check is necessary
				 * because all numbers are >= `null` according to JavaScript.
				 */
				if (
					smallestWidthBeforeOverflow.current !== null &&
					availableWidth >= smallestWidthBeforeOverflow.current
				) {
					return false
				}

				/**
				 * If there is not enough available width for the target element, but
				 * the target element width and available width are the same and the
				 * element is currently in the `hasOverflow` state, then keep the
				 * element in an overflow state.
				 *
				 * Without this condition in place, the element will endlessly flash
				 * between the true and false `hasOverflow` state.
				 */
				if (targetWidth === availableWidth && previouslyHadOverflow) {
					return true
				}

				return targetWidth > availableWidth
			})
		}

		/**
		 * Use `requestAnimationFrame` to excute `checkOverflow` during the next
		 * browser repaint cycle.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
		 */
		function requestOverflow() {
			if (!requestId) {
				requestId = requestAnimationFrame(checkOverflow)
			}
		}

		/**
		 * Set up the MutationObserver.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		 */
		const mutationObserver = new MutationObserver(requestOverflow)
		mutationObserver.observe(target, MUTATION_OPTS)

		/**
		 * Handle when an overflow-ref-using element is rendered into tabs,
		 * observing the tab panel (which is expected to change visibility).
		 */
		const targetParentNode = target.closest('[role="tabpanel"]')
		if (targetParentNode) {
			mutationObserver.observe(targetParentNode, MUTATION_OPTS)
		}

		/**
		 * Add a resize event listener to the viewport.
		 */
		viewport.addEventListener('resize', requestOverflow)

		/**
		 * Invoke the resize event listener on first render.
		 */
		requestOverflow()

		/**
		 * Clean-up resources just before unmount.
		 */
		return () => {
			cancelAnimationFrame(requestId)
			viewport.removeEventListener('resize', requestOverflow)
			mutationObserver.disconnect()
		}
	}, [])

	return [hasOverflow, overflowTargetRef]
}

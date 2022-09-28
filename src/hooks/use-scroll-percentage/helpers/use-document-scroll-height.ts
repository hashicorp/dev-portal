import { useState } from 'react'
import useSafeLayoutEffect from 'hooks/use-safe-layout-effect'

/**
 * Monitor the scroll height of the document.
 *
 * We expect the following changes to affect the document scroll height:
 * - Document height changes, such as tabbed content opening and closing.
 *   Note: we don't monitor the whole document, as that would be very taxing.
 *   Instead, we expect the hook consumer to provide a query selector
 *   that targets an element that is expected to have the greatest effect
 *   on scroll height. This is less exact, in that mutations outside that
 *   target element might affect scroll height and be missed, but seems
 *   like a decent tradeoff for improved performance.
 * - Viewport is resized, causing reflow, which affects document scroll height
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
export function useDocumentScrollHeight(
	mutationTargetSelector: string
): number {
	const [documentScrollHeight, setDocumentScrollHeight] = useState<number>()

	useSafeLayoutEffect(() => {
		/**
		 * Note: If the provided mutationTargetSelector doesn't yield an element,
		 * we'll skip adding the mutation observer.
		 */
		const mutationTarget = document.querySelector(mutationTargetSelector)
		const scrollHeightTarget = document.documentElement
		const viewport = document.defaultView

		let requestId

		/**
		 * Check & update the scroll height of the document.
		 */
		function updateDocumentScrollHeight() {
			requestId = null
			setDocumentScrollHeight(scrollHeightTarget.scrollHeight)
		}

		/**
		 * Use `requestAnimationFrame` to execute `updateDocumentScrollHeight` during the next
		 * browser repaint cycle.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
		 */
		function requestDocumentHeightUpdate() {
			console.log('document scroll height update...')
			if (!requestId) {
				requestId = requestAnimationFrame(updateDocumentScrollHeight)
			}
		}

		/**
		 * Set up the MutationObserver on the document.
		 * When document contents change, we could see a significant change in
		 * the document's scrollHeight.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		 */
		let mutationObserver
		if (mutationTarget) {
			mutationObserver = new MutationObserver(requestDocumentHeightUpdate)
			mutationObserver.observe(mutationTarget, {
				attributes: true,
				childList: true,
				subtree: true,
			})
		}

		/**
		 * Add a resize event listener to the viewport.
		 * Document scroll height will likely change when the viewport is resized.
		 */
		viewport.addEventListener('resize', requestDocumentHeightUpdate)

		/**
		 * Invoke the resize event listener on first render.
		 */
		requestDocumentHeightUpdate()

		/**
		 * Clean-up resources just before unmount.
		 */
		return () => {
			cancelAnimationFrame(requestId)
			viewport.removeEventListener('resize', requestDocumentHeightUpdate)
			if (mutationObserver) {
				mutationObserver.disconnect()
			}
		}
	}, [])

	return documentScrollHeight
}

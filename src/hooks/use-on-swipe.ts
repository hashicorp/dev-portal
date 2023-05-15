/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MutableRefObject, useEffect, useRef } from 'react'

interface UseOnSwipeOptions {
	diffThreshold?: number
	onSwipeLeft: () => void
	onSwipeRight: () => void
	ref: MutableRefObject<HTMLElement>
}

const DEFAULT_CLIENT_X_DIFF_THRESHOLD = 20

/**
 * Given a ref associated with a swipeable HTML element and callback functions
 * swiping left and swiping right, invokes the appropriate callback when a swipe
 * is detected.
 *
 * Note: if we find the need to listen for more than touch events in the future,
 * React Aria's useMove hook may be something we can leverage. At the time of
 * writing, we do not yet have a need for all of its functionality.
 *
 * https://react-spectrum.adobe.com/react-aria/useMove.html
 */
const useOnSwipe = ({
	diffThreshold = DEFAULT_CLIENT_X_DIFF_THRESHOLD,
	onSwipeLeft,
	onSwipeRight,
	ref,
}: UseOnSwipeOptions): void => {
	const clientX = useRef<number>()

	useEffect(() => {
		const elementWithListeners = ref.current

		const handleTouchStart = (event: TouchEvent) => {
			const firstTouch = event.touches.item(0)
			clientX.current = firstTouch.clientX
		}

		const handleTouchEnd = (event: TouchEvent) => {
			const changedTouch = event.changedTouches.item(0)
			const clientXDiff = clientX.current - changedTouch.clientX

			// If the diff is negligble, then the swipe was too small to be meaningful
			if (clientXDiff === 0 || Math.abs(clientXDiff) <= diffThreshold) {
				return
			}

			if (clientXDiff < 0) {
				onSwipeLeft()
			} else {
				onSwipeRight()
			}
		}

		elementWithListeners.addEventListener('touchstart', handleTouchStart)
		elementWithListeners.addEventListener('touchend', handleTouchEnd)

		return () => {
			elementWithListeners.removeEventListener('touchstart', handleTouchStart)
			elementWithListeners.removeEventListener('touchend', handleTouchEnd)
		}
	}, [diffThreshold, onSwipeLeft, onSwipeRight, ref])
}

export type { UseOnSwipeOptions }
export { useOnSwipe }

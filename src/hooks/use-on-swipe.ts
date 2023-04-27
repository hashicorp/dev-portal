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

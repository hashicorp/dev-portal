import { useEffect, useState, MutableRefObject } from 'react'

/**
 * Given a `ref`, returns a `boolean` indicating whether the `ref.current`
 * element is visible on screen.
 *
 * From https://usehooks.com/useOnScreen/
 */
function useOnScreen(ref: MutableRefObject<HTMLElement>): boolean {
	const [isIntersecting, setIntersecting] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]: [IntersectionObserverEntry]) => {
				// Update our state when the observer callback fires
				setIntersecting(entry.isIntersecting)
			}
		)
		const element = ref.current

		// Observe the element
		if (element) {
			observer.observe(element)
		}
		// Unobserve the element during cleanup
		return () => {
			if (element) {
				observer.unobserve(element)
			}
		}
	}, []) // Empty array ensures that effect is only run on mount and unmount

	return isIntersecting
}

export default useOnScreen

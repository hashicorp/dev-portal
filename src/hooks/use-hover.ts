import { useRef, useState, useCallback, RefCallback } from 'react'

/**
 * useHover hook with callback ref.
 * From https://gist.github.com/gragland/a32d08580b7e0604ff02cb069826ca2f
 */
function useHover<T = HTMLElement>(): [RefCallback<T>, boolean] {
	const [value, setValue] = useState(false)

	// Wrap in useCallback so we can use in dependencies below
	const handleMouseOver = useCallback(() => setValue(true), [])
	const handleMouseOut = useCallback(() => setValue(false), [])

	// Keep track of the last node passed to callbackRef
	// so we can remove its event listeners.
	const ref = useRef<T>()

	// Use a callback ref instead of useEffect so that event listeners
	// get changed in the case that the returned ref gets added to
	// a different element later.
	const callbackRef = useCallback(
		(node) => {
			if (ref.current && ref.current instanceof HTMLElement) {
				ref.current.removeEventListener('mouseover', handleMouseOver)
				ref.current.removeEventListener('mouseout', handleMouseOut)
			}

			ref.current = node

			if (ref.current && ref.current instanceof HTMLElement) {
				ref.current.addEventListener('mouseover', handleMouseOver)
				ref.current.addEventListener('mouseout', handleMouseOut)
			}
		},
		[handleMouseOver, handleMouseOut]
	)
	return [callbackRef, value]
}
export default useHover

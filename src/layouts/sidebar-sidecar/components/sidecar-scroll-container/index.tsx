import { ReactNode, useEffect, useState } from 'react'
import classNames from 'classnames'
import useWindowSize from 'hooks/use-window-size'
import s from './sidecar-scroll-container.module.css'

/**
 * Scroll data keeps track of whether we're at the start or end
 * of scrolling the sidecar contents. This informs whether we display
 * gradient scrims, which provide a visual clue for scrollability.
 */
interface ScrollData {
	isScrollable: boolean
	isAtStart?: boolean
	isAtEnd?: boolean
}

/**
 * Renders a scrollable container intended for sidecar contents,
 * with a gradient scrim at the bottom of the container.
 */
function SidecarScrollContainer({ children }: { children: ReactNode }) {
	const windowSize = useWindowSize()
	const [scrollData, setScrollData] = useState<ScrollData>({
		isScrollable: false,
	})

	/**
	 * Handle scroll.
	 * Gradient scrims at the top and bottom of the scrollable container
	 * are conditionally displayed, when the container is scrollable:
	 * - If we're more than 0% scrolled, a gradient scrim at the top is shown
	 * - If we're not yet 100% scrolled, a gradient scrim at the bottom is shown
	 */
	function handleScroll(e) {
		const { scrollTop, scrollHeight, clientHeight } = e.target
		const scrollMax = scrollHeight - clientHeight
		const scrollPercent = Math.round((100 * scrollTop) / scrollMax)
		const isValid = !Number.isNaN(scrollPercent)
		if (isValid) {
			const isAtStart = isScrollable && scrollPercent === 0
			const isAtEnd = isScrollable && scrollPercent === 100
			setScrollData({ isScrollable: true, isAtEnd, isAtStart })
		}
	}

	/**
	 * When the window is resized, reset to { isScrollable: false }.
	 * This ensures we don't show a gradient scrim when it's not needed.
	 * Note: we could get more fancy here, as sometimes we'll hide the scrim
	 * when in fact the area is still scrollable, but the effect is subtle
	 * enough that this seems to work well enough.
	 */
	useEffect(() => {
		setScrollData({ isScrollable: false })
	}, [windowSize])

	const { isScrollable, isAtStart, isAtEnd } = scrollData

	return (
		<div
			className={classNames(s.root, {
				[s.showTopScrim]: isScrollable && !isAtStart,
				[s.showBottomScrim]: isScrollable && !isAtEnd,
			})}
		>
			<div className={s.scrollContainer} onScroll={handleScroll}>
				{children}
			</div>
		</div>
	)
}

export { SidecarScrollContainer }

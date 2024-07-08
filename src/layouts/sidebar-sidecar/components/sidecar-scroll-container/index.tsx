/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import useWindowSize from 'hooks/use-window-size'
import { getScrollData, ScrollData } from './utils/get-scroll-data'
import s from './sidecar-scroll-container.module.css'

/**
 * Renders a scrollable container intended for sidecar contents,
 * with a gradient scrim at the bottom of the container.
 *
 * Gradient scrims at the top and bottom of the scrollable container
 * are conditionally displayed, when the container is scrollable:
 * - If we're more than 0% scrolled, a gradient scrim at the top is shown
 * - If we're not yet 100% scrolled, a gradient scrim at the bottom is shown
 */
function SidecarScrollContainer({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const windowSize = useWindowSize()
	const scrollRef = useRef<HTMLDivElement>()
	const [{ isScrollable, isAtStart, isAtEnd }, setScrollData] =
		useState<ScrollData>({
			isScrollable: false,
		})

	/**
	 * Handle scroll, updating data for gradient scrims.
	 * Note this fires only when the scrollRef container is scrolled.
	 */
	function handleScroll(e) {
		setScrollData(getScrollData(e.target))
	}

	/**
	 * Handle window resize, updating data for gradient scrims.
	 * Note this fires on initial load, and subsequent viewport resizing.
	 */
	useEffect(() => {
		setScrollData(getScrollData(scrollRef.current))
	}, [windowSize])

	/**
	 * When the route changes, check if we still need gradient scrims.
	 */
	useEffect(() => {
		setScrollData(getScrollData(scrollRef.current))
	}, [pathname])

	return (
		<div
			className={classNames(s.root, {
				[s.showTopScrim]: isScrollable && !isAtStart,
				[s.showBottomScrim]: isScrollable && !isAtEnd,
			})}
		>
			<div
				ref={scrollRef}
				className={s.scrollContainer}
				onScroll={handleScroll}
			>
				{children}
			</div>
		</div>
	)
}

export { SidecarScrollContainer }

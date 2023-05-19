/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { getScrollData, type ScrollData } from 'lib/get-scroll-data'
import s from './mdx-table.module.css'

/**
 * Lightweight wrapper around the native <table> element. Encapsulates styles,
 * enables scrolling when tables are too tall or wide, and uses `tabindex="0"`
 * to enable keyboard-only users to access the overflowed content.
 *
 * @TODO add role="region" + aria-label
 *
 * https://www.tpgi.com/short-note-on-improving-usability-of-scrollable-regions/
 */
export function MdxTable(props: JSX.IntrinsicElements['table']) {
	const scrollableRef = useRef<HTMLDivElement>()
	const [{ isScrollable, isAtStart, isAtEnd }, setScrollData] =
		useState<ScrollData>({
			isScrollable: false,
			isAtStart: null,
			isAtEnd: null,
		})
	const showLeftScrim = isScrollable && !isAtStart
	const showRightScrim = isScrollable && !isAtEnd

	/**
	 * Set up resize & scroll listeners that check whether or not a table has
	 * horizontal overflow. The scroll data obtained is used for:
	 *  - setting `tabIndex` (to make scrollable tables keyboard operable)
	 *  - rendering "more content" scrims along the left & right edges of a table
	 */
	useEffect(() => {
		const scrollableElement = scrollableRef.current

		const scrollListener = () => {
			setScrollData(getScrollData({ element: scrollableRef.current }))
		}

		setScrollData(getScrollData({ element: scrollableRef.current }))

		window.addEventListener('resize', scrollListener)
		scrollableElement.addEventListener('scroll', scrollListener)

		return () => {
			window.removeEventListener('resize', scrollListener)
			scrollableElement.removeEventListener('scroll', scrollListener)
		}
	}, [])

	/**
	 * `tabIndex` is only needed if a table is scrollable AKA has "hidden"
	 * content. If all of the content is already visible, then there is no need
	 * for the table to be an extra TAB stop.
	 */
	const tabIndex = isScrollable ? 0 : undefined

	return (
		<div className={s.root}>
			<div
				className={classNames(s.tableWrapper)}
				ref={scrollableRef}
				tabIndex={tabIndex}
			>
				<table {...props} />
			</div>
			<div className={s.tableFocusRing} />
			{/**
			 * Scrims are not conditionally rendered because it would cause hydration
			 * mismatch errors.
			 */}
			<div>
				<div
					className={classNames(s.leftScrim, showLeftScrim && s.showScrim)}
				/>
				<div
					className={classNames(s.rightScrim, showRightScrim && s.showScrim)}
				/>
			</div>
		</div>
	)
}

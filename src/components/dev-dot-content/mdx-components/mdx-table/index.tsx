/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import s from './mdx-table.module.css'

type ScrollableRefElement = HTMLDivElement

interface ScrollData {
	isScrollable: boolean
	isAtStart?: boolean
	isAtEnd?: boolean
}

const getScrollData = (element: ScrollableRefElement): ScrollData => {
	const { clientWidth, scrollLeft, scrollWidth } = element

	const isScrollable = scrollWidth > clientWidth
	const isAtStart = scrollLeft === 0
	const isAtEnd = scrollWidth - clientWidth - scrollLeft <= 10

	return {
		isScrollable,
		isAtStart,
		isAtEnd,
	}
}

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
	const scrollableRef = useRef<ScrollableRefElement>()
	const [{ isScrollable, isAtStart, isAtEnd }, setScrollData] =
		useState<ScrollData>({
			isScrollable: false,
		})
	const showLeftScrim = isScrollable && !isAtStart
	const showRightScrim = isScrollable && !isAtEnd

	useEffect(() => {
		const scrollableElement = scrollableRef.current

		const scrollListener = () => {
			setScrollData(getScrollData(scrollableRef.current))
		}

		setScrollData(getScrollData(scrollableRef.current))

		window.addEventListener('resize', scrollListener)
		scrollableElement.addEventListener('scroll', scrollListener)

		return () => {
			window.removeEventListener('resize', scrollListener)
			scrollableElement.removeEventListener('scroll', scrollListener)
		}
	}, [])

	return (
		<div className={s.root}>
			<div
				className={classNames(s.tableWrapper)}
				ref={scrollableRef}
				tabIndex={isScrollable ? 0 : undefined}
			>
				<table {...props} />
			</div>
			<div className={s.tableFocusRing} />
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

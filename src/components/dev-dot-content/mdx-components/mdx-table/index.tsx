/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import s from './mdx-table.module.css'

const getScrollData = (element) => {
	const { scrollLeft, scrollWidth, clientWidth, offsetWidth } = element

	const isScrollable = scrollWidth > clientWidth
	const isAtStart = scrollLeft === 0
	const isAtEnd = scrollWidth - clientWidth - scrollLeft <= 10
	const scrollbarWidth = offsetWidth - clientWidth

	return {
		isScrollable,
		isAtStart,
		isAtEnd,
		scrollbarWidth,
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
	const scrollableRef = useRef<HTMLDivElement>()
	const [{ isScrollable, isAtStart, isAtEnd, scrollbarWidth }, setScrollData] =
		useState<{
			isScrollable: boolean
			isAtStart?: boolean
			isAtEnd?: boolean
			scrollbarWidth?: number
		}>({
			isScrollable: false,
		})
	const showLeftScrim = isScrollable && !isAtStart
	const showRightScrim = isScrollable && !isAtEnd

	useLayoutEffect(() => {
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
			<div
				style={
					{
						'--horizontal-scrollbar-width': `${scrollbarWidth}px`,
					} as CSSProperties
				}
			>
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

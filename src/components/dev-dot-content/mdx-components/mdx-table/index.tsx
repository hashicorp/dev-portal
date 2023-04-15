/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties, useLayoutEffect, useRef, useState } from 'react'
import s from './mdx-table.module.css'
import classNames from 'classnames'

const getHorizontalScrollData = (element) => {
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

const getVerticalScrollData = (element) => {
	const { scrollTop, scrollHeight, clientHeight, offsetHeight } = element

	const isScrollable = scrollHeight > clientHeight
	const isAtStart = scrollTop === 0
	const isAtEnd = scrollHeight - clientHeight - scrollTop <= 10
	const scrollbarWidth = offsetHeight - clientHeight

	return {
		isScrollable,
		isAtStart,
		isAtEnd,
		scrollbarWidth,
	}
}

const getScrollData = (element) => {
	return {
		horizontal: getHorizontalScrollData(element),
		vertical: getVerticalScrollData(element),
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
	const [scrollData, setScrollData] = useState<{
		horizontal: {
			isScrollable: boolean
			isAtStart?: boolean
			isAtEnd?: boolean
			scrollbarWidth?: number
		}
		vertical: {
			isScrollable: boolean
			isAtStart?: boolean
			isAtEnd?: boolean
			scrollbarWidth?: number
		}
	}>({
		horizontal: {
			isScrollable: false,
		},
		vertical: {
			isScrollable: false,
		},
	})

	useLayoutEffect(() => {
		const scrollableElement = scrollableRef.current

		const scrollListener = (event) => {
			setScrollData(getScrollData(event.target))
		}

		setScrollData(getScrollData(scrollableRef.current))

		window.addEventListener('resize', scrollListener)
		scrollableElement.addEventListener('scroll', scrollListener)

		return () => {
			window.removeEventListener('resize', scrollListener)
			scrollableElement.removeEventListener('scroll', scrollListener)
		}
	}, [])

	const isScrollable =
		scrollData.horizontal.isScrollable && scrollData.vertical.isScrollable
	const showTopScrim =
		scrollData.vertical.isScrollable && !scrollData.vertical.isAtStart
	const showBottomScrim =
		scrollData.vertical.isScrollable && !scrollData.vertical.isAtEnd
	const showLeftScrim =
		scrollData.horizontal.isScrollable && !scrollData.horizontal.isAtStart
	const showRightScrim =
		scrollData.horizontal.isScrollable && !scrollData.horizontal.isAtEnd

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
						'--horizontal-scrollbar-width': `${scrollData.horizontal.scrollbarWidth}px`,
						'--vertical-scrollbar-width': `${scrollData.vertical.scrollbarWidth}px`,
					} as CSSProperties
				}
			>
				<div className={classNames(s.topScrim, showTopScrim && s.showScrim)} />
				<div
					className={classNames(s.bottomScrim, showBottomScrim && s.showScrim)}
				/>
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

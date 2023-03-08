/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Scroll data keeps track of whether we're at the start or end
 * of scrolling the sidecar contents.
 */
export interface ScrollData {
	isScrollable: boolean
	isAtStart?: boolean
	isAtEnd?: boolean
}

/**
 * Get some specific scroll data for a scrollable element.
 *
 * This data is intended for cases where we want to know:
 * - Whether the element is scrollable
 * - If scrollable, whether we're at the very start of scrolling
 * - If scrollable, whether we're at the very end of scrolling
 */
function getScrollData(element: HTMLElement): ScrollData {
	const { scrollTop, scrollHeight, clientHeight } = element
	const scrollMax = scrollHeight - clientHeight
	const isScrollable = scrollMax > 0
	const scrollPercent = Math.round((100 * scrollTop) / scrollMax)
	const isValid = !Number.isNaN(scrollPercent)
	if (isValid) {
		const isAtStart = isScrollable && scrollPercent === 0
		const isAtEnd = isScrollable && scrollPercent === 100
		return { isScrollable, isAtStart, isAtEnd }
	} else {
		return { isScrollable }
	}
}

export { getScrollData }

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

interface ScrollData {
	isScrollable: boolean
	isAtStart: boolean
	isAtEnd: boolean
}

interface GetScrollDataOptions {
	element: HTMLElement
	thresholds?: {
		isScrollable?: number
		isAtStart?: number
		isAtEnd?: number
	}
}

type GetScrollDataResult = ScrollData

const DEFAULT_THRESHOLD = 10

/**
 * Given an HTML element, determines if the element:
 *  - is horizontally scrollable / has horizontal overflow
 *  - is scrolled at all
 *  - is fully scrolled
 */
const getScrollData = ({
	element,
	thresholds = {},
}: GetScrollDataOptions): GetScrollDataResult => {
	// Pull properties from given element that are used to derive booleans
	const { clientWidth, scrollLeft, scrollWidth } = element

	// Pull threshold options, defaulting to the value of a local constant
	const {
		isScrollable: isScrollableThreshold = DEFAULT_THRESHOLD,
		isAtStart: isAtStartThreshold = DEFAULT_THRESHOLD,
		isAtEnd: isAtEndThreshold = DEFAULT_THRESHOLD,
	} = thresholds

	// Calculate whether or not the element is scrollable (aka "has overflow")
	const widthDifference = scrollWidth - clientWidth
	const isScrollable = widthDifference >= isScrollableThreshold

	// Calculate if the element has been scrolled or not
	const distanceFromStart = scrollLeft
	const isAtStart = distanceFromStart <= isAtStartThreshold

	// Calculate if the element is fully scrolled
	const maxScrollLeft = widthDifference
	const isAtEnd = maxScrollLeft - scrollLeft <= isAtEndThreshold

	// Return the derived booleans
	return {
		isScrollable,
		isAtStart,
		isAtEnd,
	}
}

export type { GetScrollDataOptions, ScrollData }
export { getScrollData }

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/* Note: please keep this in sync with `props.js`.
   TODO: If Swingset supported Typescript types, we'd be able to skip this.
	 Task: https://app.asana.com/0/1199715139452823/1199702038395513/f */

/**
 * Individual outline links
 */
export interface OutlineLinkProps {
	title: string
	url: string
	isActive?: boolean
	/**
	 * An optional `data-heap-track` attribute to attach to the link element.
	 */
	dataHeapTrack?: string
}

/**
 * Individual outline links with nested items.
 */
export interface OutlineLinkWithNestingProps extends OutlineLinkProps {
	items: OutlineLinkItem[]
}

/**
 * Mixed type for basic or nested items.
 */
export type OutlineLinkItem = OutlineLinkProps | OutlineLinkWithNestingProps

/**
 * Prop types for the presentational component.
 */
export interface OutlineNavProps {
	items: OutlineLinkItem[]
}

/**
 * Heading type, for compatibility with existing conventions.
 */
export interface OutlineHeading {
	title: string
	slug: string
	level: 1 | 2 | 3 | 4 | 5 | 6
}

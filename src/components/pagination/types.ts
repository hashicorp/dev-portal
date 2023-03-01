/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface PaginationProps {
	/** Pass the total number of items to be paginated. If no value is defined an error will be thrown. */
	totalItems: number
	/** Pass the maximum number of items to display on each page initially. If no value is defined an error will be thrown. */
	pageSize: number
	/**
	 * Set a custom initial selected page.
	 *
	 * Default: `1`
	 */
	page?: number
	/** A callback that fires when the page value changes */
	onPageChange?: (page: number) => void
	/** A callback that fires when the page size value changes */
	onPageSizeChange?: (pagesize: number) => void
}

export interface InfoProps {
	/**
	 * Hide display of total items in the UI.
	 *
	 * Defaults to `true`
	 */
	showTotalItems?: boolean
}

export interface NavProps {
	/**
	 * Sets the type of Pagination.Nav.
	 */
	type?: 'compact' | 'numbered' | 'truncated'
}

export interface ButtonArrowProps {
	type: NavProps['type']
	direction: 'next' | 'prev'
}

export interface ButtonNumberProps {
	page: number
	active?: boolean
}

export interface SizeSelectorProps {
	/**
	 * Set the page sizes users can select from. If no value is defined an error will be thrown.
	 */
	sizes: number[]
}

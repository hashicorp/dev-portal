/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export type fileContentEntry = {
	title?: string
	routes?: fileContentEntry[]
	divider?: boolean
	path?: string
	href?: string
	badge?: {
		text: string
		color: string
		type: string
	}
	hidden?: boolean
	heading?: string
}
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export type PreFooterIconSlug = 'support' | 'help' | 'user'

export interface PreFooterAction {
	icon: PreFooterIconSlug
	heading: string
	description: string
	link: string
}

export interface PreFooterProps {
	heading: string
	description: string
	actions: PreFooterAction[]
}

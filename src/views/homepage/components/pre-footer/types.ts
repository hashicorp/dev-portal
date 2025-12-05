/**
 * Copyright IBM Corp. 2021, 2025
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

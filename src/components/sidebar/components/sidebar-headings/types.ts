/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

interface SidebarSectionHeadingProps {
	text: string
}

interface SidebarTitleHeadingProps {
	id: string
	text: string
}

interface SidebarSectionBrandedHeadingProps {
	text: string
	theme?: ProductSlug
}

export type {
	SidebarSectionHeadingProps,
	SidebarTitleHeadingProps,
	SidebarSectionBrandedHeadingProps,
}

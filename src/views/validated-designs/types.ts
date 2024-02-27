/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

export interface HvdCategoryGroup {
	slug: string // start of slug e.g. terraform-operation-guides-adoption, used to add to it's guides after the category group is created
	title: string // from YAML
	description: string // from YAML
	product: Exclude<ProductSlug, 'sentinel'>
	guides: HvdGuide[]
}

export interface HvdGuide {
	slug: string // base slug e.g. terraform-operation-guides-adoption
	title: string // from YAML
	description: string // from YAML
	href: string // e.g. /validated-designs/terraform-operation-guides-adoption
	pages: HvdPage[]
}

export interface HvdPage {
	slug: string // e.g. people-and-process
	title: string // e.g. people and process
	href: string // e.g. /validated-designs/terraform-operation-guides-adoption/people-and-process
	filePath: string // full path to the file e.g. /content/terraform/operation-guides/adoption/0000-people-and-process.mdx
}

export interface HvdPageMenuItem extends HvdPage {
	isActive: boolean
}

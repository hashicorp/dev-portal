/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ProductSlug } from 'types/products'
import { type SolutionType } from './types'

/**
 * An object mapping `SolutionType`s to arrays of `ProductSlug`s. Used to
 * customize styles by `SolutionType`.
 */
const PRODUCT_SLUGS_BY_SOLUTION_TYPE: Record<SolutionType, ProductSlug[]> = {
	application: ['nomad', 'waypoint', 'vagrant'],
	infrastructure: ['packer', 'terraform'],
	networking: ['consul'],
	notSpecified: ['hcp'],
	security: ['boundary', 'vault'],
}

/**
 * An array specifying the order in which `SolutionType`s are rendered.
 */
const SOLUTION_TYPES_IN_DISPLAY_ORDER: SolutionType[] = [
	'notSpecified',
	'infrastructure',
	'networking',
	'security',
	'application',
]

export { PRODUCT_SLUGS_BY_SOLUTION_TYPE, SOLUTION_TYPES_IN_DISPLAY_ORDER }

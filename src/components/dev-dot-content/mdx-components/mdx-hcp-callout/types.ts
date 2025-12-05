/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { HcpProductSlug } from 'types/products'

export type SolutionOption =
	| 'applications'
	| 'infrastructure'
	| 'networking'
	| 'security'

export interface HCPCalloutProps {
	product: HcpProductSlug
}

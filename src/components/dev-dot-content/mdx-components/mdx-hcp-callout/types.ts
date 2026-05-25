/**
 * Copyright IBM Corp. 2022, 2026
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

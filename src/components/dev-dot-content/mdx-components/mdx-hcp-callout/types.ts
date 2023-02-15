/**
 * Copyright (c) HashiCorp, Inc.
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

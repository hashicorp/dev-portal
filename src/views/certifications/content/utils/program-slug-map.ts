/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CertificationProductSlug, ProgramSlug } from '../../types'

/**
 * Map a product that has certifications
 * to its corresponding certification program name.
 */
export const certificationProgramSlugMap: Record<
	CertificationProductSlug,
	ProgramSlug
> = {
	consul: 'security-automation',
	terraform: 'infrastructure-automation',
	vault: 'security-automation',
}

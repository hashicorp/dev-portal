/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProgramSlug } from 'views/certifications/types'

export interface ProgramHeroProps {
	heading: string
	description: string
	slug: ProgramSlug
}

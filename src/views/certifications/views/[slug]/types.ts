/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { HeadMetadataProps } from 'components/head-metadata/types'
import { ProgramSlug } from 'views/certifications/types'
import { CertificationProgram } from 'views/certifications/types'

export interface CertificationProgramViewProps {
	/**
	 * The certification program slug, such as "infrastructure-automation".
	 */
	slug: ProgramSlug

	/**
	 * Content to render for this certification program.
	 */
	pageContent: CertificationProgram

	/**
	 * Optional metadata, passed to `components/head-metadata` via _app.tsx.
	 */
	metadata?: HeadMetadataProps
}

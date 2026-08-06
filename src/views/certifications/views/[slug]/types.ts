/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { HeadMetadataProps } from 'components/head-metadata/types'
import { ProgramSlug } from 'views/certifications/types'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'

export interface CertificationProgramViewProps {
	/**
	 * The certification program slug, such as "terraform-associate".
	 */
	slug: ProgramSlug

	/**
	 * Content to render for this certification program.
	 */
	pageContent: CertificationProgram

	/**
	 * List of all exams found across every product (currently only Terraform & Vault)
	 */
	exams: Exam[]

	/**
	 * Optional metadata, passed to `components/head-metadata` via _app.tsx.
	 */
	metadata?: HeadMetadataProps
}

/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { HeadMetadataProps } from 'components/head-metadata/types'
import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'
import { RawLandingPageContent } from 'views/certifications/content/schemas/landing-page'

type LandingPageContent = RawLandingPageContent

export interface CertificationLandingProps {
	/**
	 * Content for the landing page.
	 */
	pageContent: LandingPageContent


	/**
	 * List of all exams found across every product (currently only Terraform & Vault)
	 */
	exams: Exam[]

	/**
	 * Optional metadata, passed to `components/head-metadata` via _app.tsx.
	 */
	metadata?: HeadMetadataProps
}

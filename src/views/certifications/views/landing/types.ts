/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { HeadMetadataProps } from 'components/head-metadata/types'
import {
	RawCertificationExam,
	RawCertificationProgram,
} from 'views/certifications/content/schemas/certification-program'
import { RawLandingPageContent } from 'views/certifications/content/schemas/landing-page'
import { FaqItem, ProgramSlug } from 'views/certifications/types'

/**
 * Summaries of each certification program are displayed on the landing page.
 */
export interface CertificationProgramSummary {
	slug: ProgramSlug
	heading: RawCertificationProgram['summary']['heading']
	description: RawCertificationProgram['summary']['description']
	exams: {
		title: RawCertificationExam['title']
		examCode?: RawCertificationExam['examCode']
		examTier?: RawCertificationExam['examTier']
		productSlug: RawCertificationExam['productSlug']
		prepareUrl?: RawCertificationExam['links']['prepare']
		registerUrl?: RawCertificationExam['links']['register']
	}[]
}

/**
 * Processed landing page content contains collected program summary data,
 * rather than the authored list of program slugs.
 */
export type LandingPageContent = Omit<
	RawLandingPageContent,
	'programSummaryOrder'
>

export interface CertificationLandingProps {
	/**
	 * Content for the hero on the landing page.
	 */
	pageContent: LandingPageContent

	/**
	 * Summaries of each individual certification program.
	 * Each program contains multiple exams.
	 */
	programSummaries: CertificationProgramSummary[]

	/**
	 * FAQ items to render on the landing page.
	 */
	faqItems: FaqItem[]

	/**
	 * Optional metadata, passed to `components/head-metadata` via _app.tsx.
	 */
	metadata?: HeadMetadataProps
}

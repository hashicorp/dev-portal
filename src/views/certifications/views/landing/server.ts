/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps } from './types'
import {
	getFaqsFromMdx,
	getAllCertificationPrograms,
} from 'views/certifications/content/utils'
import { LandingPageSchema } from 'views/certifications/content/schemas/landing-page'
import { formatProgramSummaries } from './utils/format-program-summaries'

const CONTENT_DIR = 'src/content/certifications'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	/**
	 * Ensure the authored content matches our expected schema
	 */
	const contentString = readLocalFile(path.join(CONTENT_DIR, 'landing.json'))
	const pageContent = LandingPageSchema.parse(JSON.parse(contentString))

	/**
	 * Format all program data into program summaries
	 */
	const allPrograms = getAllCertificationPrograms()
	const programSummaries = formatProgramSummaries(
		allPrograms,
		pageContent.programSummaryOrder
	)

	/**
	 * Parse landing page FAQs from an MDX file
	 */
	const faqMdxString = readLocalFile(path.join(CONTENT_DIR, 'landing-faq.mdx'))
	const faqItems = await getFaqsFromMdx(faqMdxString)

	/**
	 * Return static props
	 */
	return {
		props: {
			pageContent,
			programSummaries,
			faqItems,
			metadata: { title: 'Certifications', localOgImage: 'certifications.jpg' },
		},
	}
}

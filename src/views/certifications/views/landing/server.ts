/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import { flattenExams } from './utils/flattenExams'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps } from './types'
import { LandingPageSchema } from 'views/certifications/content/schemas/landing-page'

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

	// Grabs all exams from every product condensed into a single list
	const exams = flattenExams()

	/**
	 * Return static props
	 */
	return {
		props: {
			pageContent,
			exams,
			metadata: { title: 'Certifications', localOgImage: 'certifications.jpg' },
		},
	}
}

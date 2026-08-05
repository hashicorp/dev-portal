/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext } from 'next'
import {
	getAllCertificationProgramSlugs,
	getCertificationProgram,
} from 'views/certifications/content/utils'
import { ProgramSlug } from 'views/certifications/types'
// Local
import { preparePageContent } from './utils/prepare-page-content'
import { flattenExams } from '../landing/utils/flattenExams'
import { CertificationProgramViewProps } from './types'

export async function getStaticProps({
	params: { slug },
}: GetStaticPropsContext<{ slug: ProgramSlug }>): Promise<{
	props: CertificationProgramViewProps
}> {
	// Fetch the authored page content
	const { pageContent: rawPageContent } = getCertificationProgram(slug)
	// Prepare the page content for rendering, such as prepping MDX source
	const pageContent = await preparePageContent(rawPageContent, slug)
	// Return static props

	// Grabs all exams from every product condensed into a single list
	const exams = flattenExams()

	return {
		props: {
			pageContent,
			slug,
			exams,
			metadata: {
				title: pageContent.title,
				localOgImage: 'certifications.jpg', // might want to change this?
			},
		},
	}
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}

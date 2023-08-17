/**
 * Copyright (c) HashiCorp, Inc.
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
import { CertificationProgramViewProps } from './types'

export async function getStaticProps({
	params: { slug },
}: GetStaticPropsContext<{ slug: ProgramSlug }>): Promise<{
	props: CertificationProgramViewProps
}> {
	// Fetch the authored page content
	const { pageContent: rawPageContent } = getCertificationProgram(slug)
	// Prepare the page content for rendering, such as prepping MDX source
	const pageContent = await preparePageContent(rawPageContent)
	// Return static props
	return {
		props: {
			pageContent,
			slug,
			metadata: {
				title: pageContent.title,
				localOgImage: 'certifications.jpg',
			},
		},
	}
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}

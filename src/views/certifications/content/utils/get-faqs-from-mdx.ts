/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { serialize } from 'lib/next-mdx-remote/serialize'
import { FaqItem } from 'views/certifications/types'
import {
	collectMdContentByHeading,
	ContentSection,
} from './collect-md-content-by-heading'

/**
 * Given a filepath to an MDX file,
 * Return an array of FAQ items, sourced from an .mdx file for the exam.
 */
export async function getFaqsFromMdx(mdxString: string): Promise<FaqItem[]> {
	// Sort MDX source into heading sections, using level 2 headings
	const contentSections = await collectMdContentByHeading(mdxString, 2)
	// Format into FAQ items
	const faqItems = await Promise.all(
		contentSections.map(async ({ title, content }: ContentSection) => {
			return { title, mdxSource: await serialize(content) }
		})
	)
	return faqItems
}

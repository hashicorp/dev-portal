/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'

/**
 * We support a limited set of program slugs.
 * Program slugs are mainly used for stylistic tweaks. This schema, and related
 * components that use the ProgramSlug type, will need to expanded
 * when additional certification programs are added.
 */
const ProgramSlugSchema = z.enum([
	'infrastructure-automation',
	'security-automation',
])

/**
 * Export the ProgramSlug enum as a type.
 */
export type ProgramSlug = z.infer<typeof ProgramSlugSchema>

/**
 * Content schema for the /certifications landing page.
 *
 * Note that much of the landing page content will be derived from
 * content written for individual certification programs.
 */
export const LandingPageSchema = z.object({
	hero: z.object({
		heading: z.string(),
		description: z.string(),
	}),
	faqHeading: z.string(),
	/**
	 * Note: these must be valid ProgramSlug values.
	 */
	programSummaryOrder: z.array(ProgramSlugSchema),
})

/**
 * Raw content for the certification landing page.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawLandingPageContent = z.infer<typeof LandingPageSchema>

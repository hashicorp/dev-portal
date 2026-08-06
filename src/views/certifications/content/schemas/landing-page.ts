/**
 * Copyright IBM Corp. 2021, 2025
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
	'infrastructure-automation', // this links to the certificationProgramSlugMap and that is used in a few places, so removing causes big issues
	'security-automation', // same as above
	'terraform-associate',
	'terraform-professional',
	'vault-associate',
	'vault-professional',
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

const certificationProgramsSchema = z.object({
	product: z.string(),
	containerDescription: z.string(),
	certData: z.array(z.object({ uuid: z.string() })),
})

export const LandingPageSchema = z.object({
	hero: z.object({
		title: z.string(),
		description: z.string(),
	}),
	announcement: z.object({
		heading: z.string(),
		text: z.string(),
		cta: z.string(),
		ctaLink: z.string(),
	}),
	certificationPrograms: z.array(certificationProgramsSchema),
})

/**
 * Raw content for the certification landing page.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawLandingPageContent = z.infer<typeof LandingPageSchema>

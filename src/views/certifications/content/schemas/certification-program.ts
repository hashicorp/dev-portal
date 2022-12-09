import { z } from 'zod'

export const CertificationItemSchema = z.object({
	title: z.string(),
	productSlug: z.enum(['consul', 'terraform', 'vault']),
	versionTested: z.string(),
	description: z.string(),
	examFaqSlug: z.string(),
	links: z
		.object({
			prepare: z.string().optional(),
			register: z.string().optional(),
		})
		.optional(),
	/**
	 * FAQ items are parsed from .mdx files. These aren't authored directly
	 * in the .json that we parse, so they're marked as optional.
	 */
	faqItems: z
		.array(
			z.object({
				title: z.string(),
				mdxSource: z.any().optional(),
			})
		)
		.optional(),
})

export const CertificationProgramSchema = z.object({
	title: z.string(),
	hero: z.object({
		heading: z.string(),
		description: z.string(),
	}),
	summary: z.object({
		heading: z.string(),
		description: z.string(),
	}),
	certifications: z.array(CertificationItemSchema),
})

export type CertificationProgram = z.infer<typeof CertificationProgramSchema>
export type CertificationItem = z.infer<typeof CertificationItemSchema>

import { z } from 'zod'

export const CertificationItemSchema = z.object({
	title: z.string(),
	links: z
		.object({
			prepare: z.string().optional(),
			register: z.string().optional(),
		})
		.optional(),
	faqItems: z.array(
		z.object({
			title: z.string(),
			content: z.string(),
			mdxSource: z.any().optional(),
		})
	),
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

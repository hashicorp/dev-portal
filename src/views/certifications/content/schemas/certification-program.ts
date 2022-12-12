import { z } from 'zod'

export const CertificationExamSchema = z.object({
	title: z.string(),
	productSlug: z.enum(['consul', 'terraform', 'vault']),
	versionTested: z.string(),
	description: z.string(),
	faqSlug: z.string(),
	links: z
		.object({
			prepare: z.string().optional(),
			register: z.string().optional(),
		})
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
	exams: z.array(CertificationExamSchema),
})

/**
 * Raw content for an individual certification program.
 *
 * Certification programs are oriented around solution areas, such as
 * "Infrastructure Automation". Each certification program can contain
 * multiple specific exams.
 */
export type RawCertificationProgram = z.infer<typeof CertificationProgramSchema>

/**
 * Raw content for an individual certification item.
 */
export type RawCertificationExam = z.infer<typeof CertificationExamSchema>

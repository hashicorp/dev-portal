import { z } from 'zod'

/**
 * Content schema for an exam.
 *
 * Each certification program can reference multiple exams.
 * For example, the Security Automation certification program
 * contains both the Vault Associate and Vault Professional exams.
 */
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

/**
 * Content schema for an individual certification program.
 *
 * Certification programs are oriented around solution areas, such as
 * "Infrastructure Automation". Each certification program can contain
 * multiple specific exams.
 */
export const CertificationProgramSchema = z.object({
	title: z.string(),
	hero: z.object({
		heading: z.string(),
		description: z.string(),
	}),
	exams: z.array(CertificationExamSchema),
})

/**
 * Raw content for an individual certification program.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawCertificationProgram = z.infer<typeof CertificationProgramSchema>

/**
 * Raw content for an individual exam item.
 */
export type RawCertificationExam = z.infer<typeof CertificationExamSchema>

import { z } from 'zod'

/**
 * We support a limited set of product slugs for Certification exam purposes.
 *
 * Product slugs are mainly used to render themed certification badges.
 * This schema, and components that use the CertificationProductSlug type,
 * will need to be expanded when additional certification programs are added.
 */
const CertificationProductSlugSchema = z.enum(['consul', 'terraform', 'vault'])

/**
 * Export the CertificationProductSlug enum as a type.
 */
export type CertificationProductSlug = z.infer<
	typeof CertificationProductSlugSchema
>

/**
 * Content schema for an exam.
 *
 * Each certification program can reference multiple exams.
 * For example, the Security Automation certification program
 * contains both the Vault Associate and Vault Professional exams.
 */
export const CertificationExamSchema = z.object({
	title: z.string(),
	examCode: z.string().optional(),
	productSlug: CertificationProductSlugSchema,
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
	summary: z.object({
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

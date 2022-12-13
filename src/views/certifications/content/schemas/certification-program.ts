import { z } from 'zod'

/**
 * Content schema for an individual certification program.
 */
export const CertificationProgramSchema = z.object({
	title: z.string(),
	hero: z.object({
		heading: z.string(),
		description: z.string(),
	}),
})

/**
 * Raw content for an individual certification program.
 *
 * Certification programs are oriented around solution areas, such as
 * "Infrastructure Automation". Each certification program can contain
 * multiple specific exams.
 */
export type RawCertificationProgram = z.infer<typeof CertificationProgramSchema>

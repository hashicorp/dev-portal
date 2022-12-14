import { z } from 'zod'

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
	/**
	 * Note: these must be valid ProgramSlug values.
	 */
	programSummarySlugs: z.array(z.string()),
})

/**
 * Raw content for the certification landing page.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawLandingPageContent = z.infer<typeof LandingPageSchema>

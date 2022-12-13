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
})

export type RawLandingPageContent = z.infer<typeof LandingPageSchema>

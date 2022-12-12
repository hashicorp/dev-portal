import { z } from 'zod'

export const LandingPageSchema = z.object({
	hero: z.object({
		heading: z.string(),
		description: z.string(),
	}),
	programSummaryOrder: z.array(z.string()),
})

export type RawLandingPageContent = z.infer<typeof LandingPageSchema>

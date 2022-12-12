import { RawLandingPageContent } from 'views/certifications/content/schemas/landing-page'
import { FaqItem } from 'views/certifications/types'

export interface CertificationProgramSummary {
	slug: string
	title: string
	description: string
	exams: {
		title: string
		productSlug: 'consul' | 'terraform' | 'vault'
		url?: string
	}[]
}

export type LandingPageContent = Omit<
	RawLandingPageContent,
	'programSummaryOrder'
>

export interface CertificationLandingProps {
	/**
	 * Content for the hero on the landing page.
	 */
	pageContent: LandingPageContent

	/**
	 * Summaries of each individual certification program.
	 * Each program contains multiple exams.
	 */
	programSummaries: CertificationProgramSummary[]

	/**
	 * FAQ items to render on the landing page.
	 */
	faqItems: FaqItem[]
}

import { FaqItem } from 'views/certifications/types'

export interface CertificationProgramSummary {
	slug: string
	title: string
	description: string
	certifications: {
		title: string
		productSlug: 'consul' | 'terraform' | 'vault'
		url?: string
	}[]
}

export interface CertificationLandingProps {
	/**
	 * Should update this with local content.
	 */
	pageContent: $TSFixMe
	/**
	 * Should update this
	 */
	programSummaries: CertificationProgramSummary[]

	/**
	 * FAQ items to render on the page.
	 */
	faqItems: FaqItem[]
}

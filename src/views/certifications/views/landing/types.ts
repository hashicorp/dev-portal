import { FaqItem } from 'views/certifications/types'
import { CertificationsNavProps } from '../../components/certifications-nav/types'

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
	navProps: CertificationsNavProps
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

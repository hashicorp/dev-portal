import { CertificationsNavProps } from '../../components/certifications-nav/types'

export interface CertificationProgramSummary {
	slug: string
	title: string
	description: string
	certifications: {
		title: string
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
}

import { CertificationProgram } from 'views/certifications/types'

export interface CertificationPageProps {
	/**
	 * The certification program slug, such as "infrastructure-automation".
	 */
	slug: string

	/**
	 * Content to render for this certification program.
	 */
	pageContent: CertificationProgram
}

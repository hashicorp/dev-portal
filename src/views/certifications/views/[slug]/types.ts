import { RawCertificationProgram } from 'views/certifications/content/schemas/certification-program'

export interface CertificationProgramViewProps {
	/**
	 * The certification program slug, such as "infrastructure-automation".
	 */
	slug: string

	/**
	 * Content to render for this certification program.
	 */
	pageContent: RawCertificationProgram
}

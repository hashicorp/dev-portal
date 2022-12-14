import { RawCertificationProgram } from 'views/certifications/content/schemas/certification-program'
import { ProgramSlug } from 'views/certifications/types'

export interface CertificationProgramViewProps {
	/**
	 * The certification program slug, such as "infrastructure-automation".
	 */
	slug: ProgramSlug

	/**
	 * Content to render for this certification program.
	 */
	pageContent: RawCertificationProgram
}

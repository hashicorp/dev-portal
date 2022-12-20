import { ProgramSlug } from 'views/certifications/types'
import { CertificationProgram } from 'views/certifications/types'

export interface CertificationProgramViewProps {
	/**
	 * The certification program slug, such as "infrastructure-automation".
	 */
	slug: ProgramSlug

	/**
	 * Content to render for this certification program.
	 */
	pageContent: CertificationProgram
}

import type { RawCertificationProgram } from './content/schemas/certification-program'

/**
 * Raw page content for individual certification program pages.
 */
export interface RawCertificationProgramItem {
	slug: string
	pageContent: RawCertificationProgram
}

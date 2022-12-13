import type { RawCertificationProgram } from './content/schemas/certification-program'

/**
 * Program slugs are mainly used for stylistic tweaks. This type, and related
 * components,  will need to expanded if additional programs are added.
 */
export type ProgramSlug =
	| 'infrastructure-automation'
	| 'security-automation'
	| 'networking-automation'

/**
 * Raw page content for individual certification program pages.
 */
export interface RawCertificationProgramItem {
	slug: string
	pageContent: RawCertificationProgram
}

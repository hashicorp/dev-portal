import { CertificationProductSlug, ProgramSlug } from '../../types'

/**
 * Map a product that has certifications
 * to its corresponding certification program name.
 */
export const certificationProgramSlugMap: Record<
	CertificationProductSlug,
	ProgramSlug
> = {
	consul: 'networking-automation',
	terraform: 'infrastructure-automation',
	vault: 'security-automation',
}

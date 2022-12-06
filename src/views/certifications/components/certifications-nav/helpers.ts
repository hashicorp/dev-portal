import { CertificationsNavProps } from './types'
import { CertificationProgramItem } from 'views/certifications/types'

/**
 * Format certification programs for a dev nav
 */
export function formatCertificationsNavProps(
	allCertificationPrograms: CertificationProgramItem[]
): CertificationsNavProps {
	const indexLink = { text: 'All Certifications', url: '/certifications' }
	const pageLinks = allCertificationPrograms.map(
		({ slug, pageContent }: CertificationProgramItem) => {
			return { text: pageContent.title, url: `/certifications/${slug}` }
		}
	)
	return { items: [indexLink, ...pageLinks] }
}

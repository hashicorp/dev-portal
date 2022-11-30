import { CertificationsNavProps } from './types'

/**
 * Again, might be nice to use Zod validation to generate types here, or something
 */
export function formatCertificationsNavProps(
	allProductCertificationPages: $TSFixMe
): CertificationsNavProps {
	const indexLink = { text: 'All Certifications', url: '/certifications' }
	const pageLinks = allProductCertificationPages.map(({ slug, title }) => {
		return { text: title, url: `/certifications/${slug}` }
	})
	return { items: [indexLink, ...pageLinks] }
}

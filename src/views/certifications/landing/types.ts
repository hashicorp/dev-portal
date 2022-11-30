import { CertificationsNavProps } from '../components/certifications-nav/types'

export interface CertificationLandingProps {
	navProps: CertificationsNavProps
	/**
	 * Should update this based on adjacent query.graphql.
	 * Might be nice time for me to try out Zod, write a schema instead of types,
	 * but then also get the types for free?
	 */
	pageContent: $TSFixMe
}

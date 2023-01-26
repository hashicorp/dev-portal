import { Integration } from 'lib/integrations-api-client/integration'
import { ReleaseComponent } from 'lib/integrations-api-client/release'

/**
 * Given data for an integration,
 * Return the URL at which the integration can be viewed.
 */
export function getIntegrationUrl(
	/** The Integration to link to. */
	{ external_only, external_url, product, organization, slug }: Integration,
	/** Optionally link to a specific version of the integration */
	version?: string
): string {
	if (external_only) {
		return external_url.replace(/^https:\/\/developer.hashicorp.com/, '')
	} else {
		const formattedOrg = formatIntegrationOrg(organization.slug)
		const baseUrl = `/${product.slug}/integrations/${formattedOrg}/${slug}`
		return version ? `${baseUrl}/${version}` : baseUrl
	}
}

/**
 * Given data for an integration and a release component of that integration,
 * Return the URL at which the release component can be viewed.
 */
export function getIntegrationComponentUrl(
	/** The Integration to link to. */
	integration: Integration,
	/** The Release Component to link to */
	releaseComponent: ReleaseComponent,
	/**
	 * Optionally link to a specific version of the related integration.
	 * Defaults to "latest" if no specific version is provided.
	 */
	version: string = 'latest'
): string {
	const integrationUrl = getIntegrationUrl(integration, version)
	return `${integrationUrl}/${releaseComponent.component.slug}`
}

/**
 * Get a formatted integration organization slug.
 * This is really just prefixing with "@", but feels worth it to have a helper
 * function for reassurance (especially in case this changes in the future).
 */
export function formatIntegrationOrg(rawOrganizationSlug: string) {
	return `@${rawOrganizationSlug}`
}

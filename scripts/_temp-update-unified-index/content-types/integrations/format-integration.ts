import { NormalizedSearchObject } from '../../types'

type ApiIntegration = $TSFixMe

/**
 * Format an integration API record into a normalized search object.
 */
export function formatIntegration(
	integrationRecord: ApiIntegration
): NormalizedSearchObject {
	const integrationSlug = integrationRecord.slug
	const productSlug = integrationRecord.product.slug
	const organizationSlug = integrationRecord.organization.slug
	return {
		objectID: integrationRecord.id,
		description: integrationRecord.description,
		page_title: integrationRecord.name,
		products: [productSlug],
		urlPath: `/${productSlug}/integrations/${organizationSlug}/${integrationSlug}`,
	}
}

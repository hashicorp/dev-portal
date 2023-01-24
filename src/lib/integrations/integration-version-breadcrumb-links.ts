import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { integrationBreadcrumbLinks } from './integration-breadcrumb-links'

/**
 * Build breadcrumb links for a versioned integration "readme" page.
 */
export function integrationVersionBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	activeRelease: Release,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	// TODO: we don't ever expect versionTitle to be "Latest", since
	// we want to redirect to the canonical "Latest" URL, I think?
	const versionTitle =
		activeRelease.version === integration.versions[0]
			? 'Latest'
			: 'v' + activeRelease.version
	return [
		...integrationBreadcrumbLinks(product, integration, false),
		{
			title: versionTitle,
			url:
				activeRelease.version === integration.versions[0]
					? null
					: `/${product.slug}/integrations/${integration.slug}/${activeRelease.version}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}

// Global imports
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { ProductData } from 'types/products'

// Integrations-related imports
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import { integrationVersionBreadcrumbLinks } from 'lib/integrations'

/**
 * Build breadcrumb links for an integration "component" page.
 */
export function integrationComponentBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	activeRelease: Release,
	releaseComponent: ReleaseComponent,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	const versionSlug =
		activeRelease.version === integration.versions[0]
			? 'latest'
			: activeRelease.version

	return [
		...integrationVersionBreadcrumbLinks(
			product,
			integration,
			activeRelease,
			false
		),
		{
			title: 'Components',
		},
		{
			title: releaseComponent.component.name,
			url: `/${product.slug}/integrations/${integration.slug}/${versionSlug}/components/${releaseComponent.component.slug}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}

import { fetchAllIntegrations } from 'lib/integrations'
import {
	Integration,
	IntegrationComponent,
} from 'lib/integrations-api-client/integration'
import { makeSitemapElement } from './helpers'
import { SitemapElement } from './types'

// product.slug/integrations/organization.slug/slug
export async function allIntegrationsUrls() {
	const allPaths = await fetchAllIntegrations([
		'vault',
		'waypoint',
		// vault & waypoint are currently the only products with integrations pages,
	])

	// component slug pattern -> current_slug/latest/components/component_slug
	// remove all external integrations, build the slug, and return it with the provided timestamp
	return allPaths
		.filter((integration: Integration) => !integration.external_only)
		.reduce(
			(
				sitemapPaths: SitemapElement[],
				{
					slug: integrationSlug,
					created_at,
					product: { slug: productSlug },
					organization: { slug: orgSlug },
					components: integrationComponents,
				}: Integration
			) => {
				const productPath = `/${productSlug}/integrations${
					integrationSlug !== 'null' ? `/${orgSlug}/${integrationSlug}` : '' // if slug is null it will be a product's basepath for integrations i.e. '.../waypoint/integrations'
				}`

				sitemapPaths.push(
					makeSitemapElement({
						slug: `${productPath}`,
						lastmodDate: String(created_at),
						priority: 0.8,
					})
				)

				if (integrationComponents) {
					sitemapPaths.push(
						...integrationComponents.reduce(
							(
								componentPaths: SitemapElement[],
								{ slug: compontentSlug }: IntegrationComponent
							) => {
								componentPaths.push(
									makeSitemapElement({
										slug: `${productPath}/latest/components/${compontentSlug}`,
										lastmodDate: String(created_at),
									})
								)

								return componentPaths
							},
							[]
						)
					)
				}

				return sitemapPaths
			},
			[]
		)
}

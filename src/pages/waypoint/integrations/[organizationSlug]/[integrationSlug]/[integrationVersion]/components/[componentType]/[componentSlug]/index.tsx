/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext, GetStaticPathsResult } from 'next'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import ProductIntegrationComponentView from 'views/product-integration/component-view'
import {
	getStaticProps as _getStaticProps,
	PathParams,
} from 'views/product-integration/component-view/server'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'
import { getLatestIntegrationVersion } from 'lib/integrations'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import { ReleaseComponent } from 'lib/integrations-api-client/release'
import InlineAlert from 'components/inline-alert'
import StandaloneLink from 'components/standalone-link'

async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	// Get products slug where integrations is enabled

	// Fetch integrations for all products
	const allIntegrations = await fetchAllProductIntegrations('waypoint')

	// Build a flat array of path parameters for each component view
	// We statically render every component view for every integration,
	// but only for the latest version of each integration.
	const allPaths: Array<PathParams> = []
	for (let i = 0; i < allIntegrations.length; i++) {
		const currentIntegration = allIntegrations[i]

		// Compute the latest version, as this is the page that we
		// will statically build
		const latestVersion = getLatestIntegrationVersion(
			currentIntegration.versions
		)

		// If the integration is 'external_only' or does not have a latest
		// version, it should not build a page
		if (currentIntegration.external_only || latestVersion === null) {
			continue
		}

		// Fetch the latest release, as we are going to generate the
		// component pages from this set of components
		const latestRelease = await fetchIntegrationRelease(
			currentIntegration.product.slug,
			currentIntegration.organization.slug,
			currentIntegration.slug,
			latestVersion
		)

		// Add a Path for each ReleaseComponent
		latestRelease.result.components.forEach(
			(releaseComponent: ReleaseComponent) => {
				allPaths.push({
					productSlug: currentIntegration.product.slug,
					integrationSlug: currentIntegration.slug,
					integrationVersion: 'latest',
					organizationSlug: currentIntegration.organization.slug,
					componentType: releaseComponent.component.slug,
					componentSlug: releaseComponent.slug,
				})
			}
		)
	}

	return {
		paths: allPaths.map((params: PathParams) => ({ params })),
		fallback: 'blocking',
	}
}

// simulate the dynamic route props used by other integrations paths
const getStaticProps = ({
	params,
}: GetStaticPropsContext<Omit<PathParams, 'productSlug'>>) => {
	return _getStaticProps({ params: { productSlug: 'waypoint', ...params } })
}

function WaypointIntegrationComponentView(props) {
	return (
		<ProductIntegrationComponentView
			{...props}
			preContentSlot={
				<InlineAlert
					title="Archive Notice"
					description="This integration relates to a legacy version of Waypoint and is no longer actively maintained."
					color="highlight"
					ctaSlot={
						<StandaloneLink
							href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
							opensInNewTab
							text="Read the blog"
							color="secondary"
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
						/>
					}
				/>
			}
		/>
	)
}

export { getStaticPaths, getStaticProps }
export default WaypointIntegrationComponentView

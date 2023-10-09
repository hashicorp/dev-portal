/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ProductIntegrationsLanding from 'views/product-integrations-landing'
import { getStaticProps as _getStaticProps } from 'views/product-integrations-landing/server'
import InlineAlert from 'components/inline-alert'
import { HeadMetadataProps } from 'components/head-metadata/types'
import { ViewProps as IntegrationsLandingViewProps } from 'views/product-integrations-landing'
import s from './integrations.module.css'

function WaypointIntegrationsLanding(
	props: IntegrationsLandingViewProps & { metadata: HeadMetadataProps }
) {
	return (
		<ProductIntegrationsLanding
			{...props}
			alertSlot={
				<InlineAlert
					title="Archive Notice"
					description="These integrations are from of a legacy version of Waypoint and are no longer actively maintained."
					color="highlight"
					className={s.alert}
					ctaSlot={
						<a
							href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
							target="_blank"
						>
							For more information, read this blog post
						</a>
					}
				/>
			}
		/>
	)
}

// simulate the dynamic route props used by other integrations paths
const getStaticProps = () =>
	_getStaticProps({ params: { productSlug: 'waypoint' } })

export default WaypointIntegrationsLanding
export { getStaticProps }

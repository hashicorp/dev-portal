/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ProductIntegrationsLanding from 'views/product-integrations-landing'
import { getStaticProps as _getStaticProps } from 'views/product-integrations-landing/server'
import InlineAlert from 'components/inline-alert'
import StandaloneLink from 'components/standalone-link'
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
						<StandaloneLink
							href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
							opensInNewTab
							text="Read the blog"
							color="secondary"
							icon={<IconExternalLink16 />}
							iconPosition="trailing"
						/>
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

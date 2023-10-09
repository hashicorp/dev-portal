/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineAlert from 'components/inline-alert'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const WaypointDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={
				<InlineAlert
					title="Archive Notice"
					description="This download is part of the legacy version of Waypoint that is no longer actively maintained."
					color="highlight"
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

const getStaticProps = generateGetStaticProps(waypointData as ProductData)

export { getStaticProps }
export default WaypointDownloadsPage

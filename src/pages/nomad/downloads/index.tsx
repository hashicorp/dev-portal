/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import InlineAlert from 'components/inline-alert'
import ButtonLink from 'components/button-link'

const NomadDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={
				<InlineAlert
					title="New beta release!"
					description="A beta for Nomad v1.6.0 is available."
					ctaSlot={
						<ButtonLink
							size="small"
							color="secondary"
							text="Download"
							icon={<IconDownload16 />}
							href="https://releases.hashicorp.com/nomad/1.6.0-beta.1/"
						/>
					}
				/>
			}
		/>
	)
}

const getStaticProps = generateGetStaticProps(nomadData as ProductData)

export { getStaticProps }
export default NomadDownloadsPage

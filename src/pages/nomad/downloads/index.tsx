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
import s from './style.module.css'

const NomadDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={
				<InlineAlert
					title="New release candidate!"
					description="A release candidate for Nomad v1.6.0 is available."
					ctaSlot={
						<ButtonLink
							aria-label="Download release candidate for Nomad v.1.6.0"
							className={s.downloadLink}
							size="small"
							color="tertiary"
							text="Download"
							icon={<IconDownload16 />}
							href="https://releases.hashicorp.com/nomad/1.6.0-rc.1/"
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

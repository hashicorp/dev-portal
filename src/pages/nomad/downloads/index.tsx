/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import Card from 'components/card'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import s from './style.module.css'

const NomadDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={
				<Card className={s.card} elevation="base">
					<Text asElement="span">
						A release candidate for Nomad v1.5.0 is available! The release can be{' '}
						<InlineLink href="https://releases.hashicorp.com/nomad/1.5.0-rc.1/">
							downloaded here
						</InlineLink>
						.
					</Text>
				</Card>
			}
		/>
	)
}

const getStaticProps = generateGetStaticProps(nomadData as ProductData)

export { getStaticProps }
export default NomadDownloadsPage

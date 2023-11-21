/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CardLink from 'components/card-link'
import Heading from 'components/heading'
import Text from 'components/text'
import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import s from './consul-downloads.module.css'

const ConsulDownloadsMerchandisingSlot = () => {
	return (
		<div>
			<Heading
				className={viewStyles.heading2}
				level={2}
				size={300}
				weight="bold"
			>
				Consul tools
			</Heading>
			<CardLink
				ariaLabel="Download Consul tools"
				href="/consul/docs/integrate/download-tools"
			>
				<Text
					asElement="p"
					className={s.downloadToolsCardTitle}
					size={300}
					weight="semibold"
				>
					Download Consul tools
				</Text>
				<Text
					asElement="p"
					className={s.downloadToolsCardDescription}
					size={200}
					weight="regular"
				>
					From this page you can download various tools for Consul. These tools
					are maintained by HashiCorp and the Consul Community.
				</Text>
			</CardLink>
		</div>
	)
}

const ConsulDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: <ConsulDownloadsMerchandisingSlot />,
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(consulData as ProductData)

export { getStaticProps }
export { ConsulDownloadsMerchandisingSlot }
export default ConsulDownloadsPage

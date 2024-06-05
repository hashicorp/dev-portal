/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Heading from 'components/heading'
import Text from 'components/text'
import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import s from './consul-downloads.module.css'
import Card from 'components/card'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import ButtonLink from 'components/button-link'

const ConsulDownloadsMerchandisingSlot = () => {
	return (
		<Card elevation="base">
			<Heading className={s.heading} level={3} size={300} weight="semibold">
				Consul Tools
			</Heading>
			<Text
				asElement="p"
				className={s.downloadToolsCardDescription}
				size={200}
				weight="regular"
			>
				From this page you can download, review lease information and much more.
				These tools are maintained by HashiCorp and the Consul community
			</Text>
			<ButtonLink
				className={s.cta}
				color="primary"
				size="small"
				href="/consul/docs/integrate/download-tools"
				icon={<IconArrowRight16 />}
				iconPosition="trailing"
				text="Explore"
			/>
		</Card>
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

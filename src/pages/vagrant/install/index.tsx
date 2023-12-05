/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import ButtonLink from 'components/button-link'
import Card from 'components/card'
import Heading from 'components/heading'
import Text from 'components/text'
import vagrantData from 'data/vagrant.json'
import { ReactElement } from 'react-markdown/lib/react-markdown'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'
import s from './vagrant-downloads.module.css'

const VagrantDownloadsMerchandisingSlot = (): ReactElement => {
	return (
		<Card elevation="base">
			<Heading className={s.heading} level={3} size={300} weight="semibold">
				VMware utility
			</Heading>
			<Text asElement="p" className={s.description} size={200} weight="regular">
				From this page you can download, review lease information and much more.
				These tools are maintained by HashiCorp and the Vagrant community
			</Text>
			<ButtonLink
				className={s.cta}
				color="primary"
				size="small"
				href="/vagrant/install/vmware"
				icon={<IconArrowRight16 />}
				iconPosition="trailing"
				text="Explore"
			/>
		</Card>
	)
}

function VagrantDownloadsPage(props: ProductDownloadsViewProps) {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: <VagrantDownloadsMerchandisingSlot />,
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default VagrantDownloadsPage

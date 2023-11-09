/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CalloutCard from 'components/callout-card'
import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'

function VagrantDownloadsPage(props: ProductDownloadsViewProps) {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: (
					<CalloutCard
						heading="VMware Utility"
						headingSlug="vmware-utility"
						body="From this page you can install the VMware utility, review lease information and much more. These tools are maintained by HashiCorp and the Vagrant Community."
						ctas={[{ text: 'Install', url: '/vagrant/install/vmware' }]}
					/>
				),
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default VagrantDownloadsPage

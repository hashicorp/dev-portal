/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CalloutCard from 'components/callout-card'
import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'
import { ProductInstallViewProps } from 'views/product-install-view/types'

function VagrantInstallPage(props: ProductInstallViewProps) {
	return (
		<ProductInstallView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: (
					<CalloutCard
						heading="VMware Utility"
						headingSlug="vmware-utility"
						body="From this page you can download the VMware utility, review lease information and much more. These tools are maintained by HashiCorp and the Vagrant Community."
						ctas={[{ text: 'Download', url: '/vagrant/downloads/vmware' }]}
					/>
				),
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default VagrantInstallPage

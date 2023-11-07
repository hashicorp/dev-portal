/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'
import { ConsulDownloadsMerchandisingSlot } from '.'

const ConsulEnterpriseDownloadsPage = (props) => {
	return (
		<ProductInstallView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: <ConsulDownloadsMerchandisingSlot />,
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(consulData as ProductData, {
	isEnterpriseMode: true,
})

export { getStaticProps }
export default ConsulEnterpriseDownloadsPage

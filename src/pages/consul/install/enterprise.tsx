/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import { ConsulDownloadsMerchandisingSlot } from '.'

const ConsulEnterpriseDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={{
				position: 'middle',
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

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'

const getStaticProps = generateGetStaticProps(vagrantData as ProductData, {
	installName: 'Vagrant VMware Utility',
	releaseSlug: 'vagrant-vmware-utility',
	jsonFilePath: `src/content/${vagrantData.slug}/install-vmware-landing.json`,
})

export { getStaticProps }
export default ProductInstallView

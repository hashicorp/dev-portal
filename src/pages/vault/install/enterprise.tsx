/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'

const getStaticProps = generateGetStaticProps(vaultData as ProductData, {
	isEnterpriseMode: true,
})

export { getStaticProps }
export default ProductInstallView

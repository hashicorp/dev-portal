/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import packerData from 'data/packer.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'

const getStaticProps = generateGetStaticProps(packerData as ProductData)

export { getStaticProps }
export default ProductInstallView

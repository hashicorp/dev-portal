/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import packerData from 'data/packer.json'
import { ProductData } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'

const getStaticProps = generateGetStaticProps(packerData as ProductData)

export { getStaticProps }
export default ProductLandingView

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default ProductLandingView

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'

const getStaticProps = generateGetStaticProps(terraformData as ProductData)

export { getStaticProps }
export default ProductLandingView

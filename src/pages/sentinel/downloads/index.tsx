/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import sentinelData from 'data/sentinel.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const getStaticProps = generateGetStaticProps(sentinelData as ProductData)

export { getStaticProps }
export default ProductDownloadsView

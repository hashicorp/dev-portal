/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const NomadDownloadsPage = (props) => {
	return <ProductDownloadsView {...props} />
}

const getStaticProps = generateGetStaticProps(nomadData as ProductData)

export { getStaticProps }
export default NomadDownloadsPage

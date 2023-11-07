/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'

const NomadDownloadsPage = (props) => {
	return <ProductInstallView {...props} />
}

const getStaticProps = generateGetStaticProps(nomadData as ProductData)

export { getStaticProps }
export default NomadDownloadsPage

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import baseProps from 'components/_proxied-dot-io/consul/downloads-props'

function DownloadsPage({ product, releases, latestVersion }) {
	return (
		<ProductDownloadsPage
			{...baseProps()}
			product={product}
			releases={releases}
			latestVersion={latestVersion}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('consul')

DownloadsPage.layout = ConsulIoLayout
export default DownloadsPage

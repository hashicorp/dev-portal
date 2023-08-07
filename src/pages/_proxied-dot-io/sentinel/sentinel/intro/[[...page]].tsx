/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Products } from '@hashicorp/platform-product-meta'
import SentinelIoLayout from 'layouts/_proxied-dot-io/sentinel'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import productData from 'data/sentinel.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'sentinel/intro'
const navDataFile = `../data/intro-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = {}

export default function SentinelDocsPage(props) {
	return (
		<SentinelIoLayout {...props.layoutProps}>
			<DocsPage
				product={product}
				baseRoute={basePath}
				staticProps={props}
				additionalComponents={additionalComponents}
				showVersionSelect={enableVersionedDocs}
				algoliaConfig={productData.algoliaConfig}
				showEditPage={false}
			/>
		</SentinelIoLayout>
	)
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
	enableVersionedDocs
		? {
				strategy: 'remote',
				basePath,
				fallback: 'blocking',
				product: productData.slug,
		  }
		: {
				strategy: 'fs',
				localContentDir,
				navDataFile,
				localPartialsDir,
				product: productData.slug,
		  }
)

// Export getStatic functions
export { getStaticPaths, getStaticProps }

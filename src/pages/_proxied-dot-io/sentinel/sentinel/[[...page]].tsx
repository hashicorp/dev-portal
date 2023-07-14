/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import SentinelIoLayout from 'layouts/_proxied-dot-io/sentinel'
import SentinelEmbedded from '@hashicorp/react-sentinel-embedded'
import remarkSentinel from 'lib/remark-sentinel'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import productData from 'data/sentinel.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'sentinel'
const navDataFile = `../data/docs-nav-data.json`
const localContentDir = `../content/sentinel/docs`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { SentinelEmbedded }

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
				remarkPlugins: [remarkSentinel],
		  }
		: {
				strategy: 'fs',
				localContentDir,
				navDataFile,
				localPartialsDir,
				product: productData.slug,
				remarkPlugins: [remarkSentinel],
		  }
)

// Export getStatic functions
export { getStaticPaths, getStaticProps }

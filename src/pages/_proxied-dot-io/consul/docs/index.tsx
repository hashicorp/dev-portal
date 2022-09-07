import { Products } from '@hashicorp/platform-product-meta'
import { ReactElement } from 'react'
import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import { DocsPageInner, DocsPageProps } from '@hashicorp/react-docs-page'
import productData from 'data/consul.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
import ProductDocsLanding from 'views/_proxied-dot-io/product-docs-landing'
// Note: content is imported directly. Could be moved to getStaticProps.
// ref: https://github.com/hashicorp/dev-portal/commit/cee04fb08dda81e95ebcf9e6ff08b6245872589b
import PAGE_CONTENT from './content.json'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'
import { GetStaticProps } from 'next'
import DevDotOptIn from 'components/_proxied-dot-io/common/dev-dot-opt-in'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)

/**
 * Note: this route is set up solely for the `/docs` landing page.
 * For other pages, we've switched `/docs/[[...page]].tsx`, an "optional catch-all",
 * to `/docs/[...page].tsx`, a "catch-all" route. As mentioned in the NextJS
 * docs, the main difference is that the latter will not match the route
 * without parameters - ie the landing page. This allows us to avoid
 * conflicting page files.
 * ref: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
 */
function ConsulDocsLandingPage({
	frontMatter,
	currentPath,
	navData,
	githubFileUrl,
	versions,
}: DocsPageProps['staticProps']): ReactElement {
	return (
		<DocsPageInner
			canonicalUrl={frontMatter.canonical_url}
			description={frontMatter.description}
			githubFileUrl={githubFileUrl}
			navData={navData}
			currentPath={currentPath}
			pageTitle={frontMatter.page_title}
			product={product}
			showEditPage={false}
			showVersionSelect={enableVersionedDocs}
			baseRoute={basePath}
			versions={versions}
			algoliaConfig={productData.algoliaConfig}
			optInBanner={<DevDotOptIn {...productData.devDotCutoverMessage} />}
		>
			<ProductDocsLanding content={PAGE_CONTENT} />
		</DocsPageInner>
	)
}

const { getStaticProps: generatedGetStaticProps } =
	getStaticGenerationFunctions(
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

// Export getStaticProps function
const getStaticProps: GetStaticProps = async (context) => {
	// Our generatedGetStaticProps expects params, so we gotta pass em,
	// even though in this context we're not getting them from NextJS
	return await generatedGetStaticProps({ ...context, params: { page: [] } })
}
export { getStaticProps }

// Export view with layout
ConsulDocsLandingPage.layout = ConsulIoLayout
export default ConsulDocsLandingPage

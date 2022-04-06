import { ReactElement } from 'react'
import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import { DocsPageInner, DocsPageProps } from '@hashicorp/react-docs-page'
import productData from 'data/consul.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// import ProductDocsLanding from 'views/_proxied-dot-io/product-docs-landing'
// Imports below are used in getStatic functions only
import fs from 'fs'
import path from 'path'
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'
import { GetStaticProps } from 'next'

const product = { name: productData.name, slug: productData.slug }
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
  landingPageContent,
}: DocsPageProps['staticProps'] & {
  landingPageContent: $TSFixMe
}): ReactElement {
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
    >
      <pre>
        <code>{JSON.stringify({ landingPageContent }, null, 2)}</code>
      </pre>
      {/* <ProductDocsLanding
        content={landingPageContent}
        themeSlug={productData.slug}
      /> */}
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
  const staticPropsResult = await generatedGetStaticProps({
    ...context,
    params: { page: [] },
  })
  // staticPropsResult is typed such that it may not have any "props",
  // we need to guard against this
  function staticPropsHasProps(
    obj: Record<string, unknown>
  ): obj is Record<string, unknown> & { props: Record<string, unknown> } {
    return typeof obj.props !== 'undefined'
  }
  if (!staticPropsHasProps(staticPropsResult)) {
    return staticPropsResult
  }
  // we know we have props, so we tack on our landing page content
  const landingPageContent = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        'src/pages/_proxied-dot-io/consul/docs/consul-docs-landing-content.json'
      ),
      'utf8'
    )
  )
  return {
    ...staticPropsResult,
    props: { ...staticPropsResult.props, landingPageContent },
  }
}
export { getStaticProps }

// Export view with layout
ConsulDocsLandingPage.layout = ConsulIoLayout
export default ConsulDocsLandingPage

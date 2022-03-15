import { ReactElement } from 'react'
import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import Card from 'components/card'
import CardLink from 'components/card-link'
import { DocsPageInner, DocsPageProps } from '@hashicorp/react-docs-page'
import productData from 'data/vault.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'
import { GetStaticProps } from 'next'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)

/**
 * Note: we've switched from `/docs/[[...page]].tsx`, an "optional catch-all",
 * to `/docs/[...page].tsx`, a "catch-all" route. As mentioned in the NextJS
 * docs, the main difference is that the latter will not match the route
 * without parameters - ie the landing page. This allows us to avoid
 * conflicting page files.
 * ref: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
 */

/**
 * Hot take: it might be nice to modify DocsPageInner so that
 * it does NOT automatically wrap content in the <Content /> component.
 * The default export, DocsPage, would do the wrapping, so would be unaffected.
 * This would open the possibility of moving away from cascading,
 * inherited styles (which leak unintentionally into custom components,
 * like Card), and towards more encapsulated styles.
 */
function VaultDocsLandingPage({
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
    >
      <h1 className="g-type-display-2">Documentation</h1>
      <p>
        Welcome to Vault documentation! Vault is an identity-based secret and
        encryption management system. This documentation covers the main
        concepts of Vault, what problems it can solve, and contains a quick
        start for using Vault.
      </p>
      <Card>
        <pre>
          <code>{`Get Started
Use Vault to securely store, access, and manage secrets and other sensitive data.
<button> CLI quick start </button> <button>Developer quick start</button>
`}</code>
        </pre>
      </Card>
      <h2 className="g-type-display-3">Use Cases</h2>
      <Card>
        <pre>
          <code>{`Secrets Management
Centrally store, access, and deploy secrets across applications, systems, and infrastructure.
Key/Value, Database Credentials, Kubernetes Secrets
`}</code>
        </pre>
      </Card>
      <Card>
        <pre>
          <code>{`Encryption Services
Securely handle data such as social security numbers, credit card numbers, and other types of compliance-regulated information.
Transit, Transform, Tokenization
`}</code>
        </pre>
      </Card>
      <Card>
        <pre>
          <code>{`Key Management
Use a standardized workflow for distribution and lifecycle management of cryptographic keys in various KMS providers.
PKI, KMIP, KMSE
`}</code>
        </pre>
      </Card>
      <h2 className="g-type-display-3">Developers</h2>
      <CardLink href="https://www.vaultproject.io/api-docs/libraries">
        Client Libraries
      </CardLink>
      <CardLink href="https://www.vaultproject.io/api-docs/index">
        API Reference
      </CardLink>
      <CardLink href="https://github.com/hashicorp/hello-vault-go">
        Sample Integrations
      </CardLink>
      <CardLink href="https://github.com/hashicorp/vault-examples">
        GitHub Samples
      </CardLink>
      {/* TODO: add some space at the bottom of the page */}
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
  return await generatedGetStaticProps({ ...context, params: { page: [] } })
}
export { getStaticProps }

// Export view with layout
VaultDocsLandingPage.layout = VaultIoLayout
export default VaultDocsLandingPage

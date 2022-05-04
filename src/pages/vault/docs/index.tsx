import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import {
  DocsViewInner,
  DocsViewMdxContent,
  DocsViewProps,
} from 'views/docs-view'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { vaultUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'docs'
const baseName = 'Docs'
const product = vaultData as ProductData

function CustomDocsView({ mdxSource, lazy }: DocsViewProps) {
  return (
    <DocsViewInner>
      <pre
        style={{
          border: '1px solid magenta',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
        }}
      >
        <code>
          I&apos;m some custom JSX content on the Vault docs landing page,
          before the MDX content!
        </code>
      </pre>
      <div style={{ border: '1px solid magenta' }}>
        This MDX content would be omitted for Vault, but not for Waypoint
        <DocsViewMdxContent mdxSource={mdxSource} lazy={lazy} />
      </div>
      <pre
        style={{
          border: '1px solid magenta',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
        }}
      >
        <code>
          More content after the MDX, this is where the Waypoint
          &quot;Popular&quot; cards would go, I think.
        </code>
      </pre>
    </DocsViewInner>
  )
}

const { getStaticProps: generatedGetStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
    additionalRemarkPlugins: [vaultUrlAdjuster],
  })

const getStaticProps: GetStaticProps = async (context) => {
  // Our generatedGetStaticProps expects params, so we gotta pass em,
  // even though in this context we're not getting them from NextJS
  return await generatedGetStaticProps({ ...context, params: { page: [] } })
}

CustomDocsView.layout = SidebarSidecarLayout

export { getStaticProps }
export default CustomDocsView

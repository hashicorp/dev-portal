import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import {
  DocsViewInner,
  DocsViewMdxContent,
  DocsViewProps,
} from 'views/docs-view'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as ProductData

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
          I&apos;m some custom JSX content on the Waypoint docs landing page,
          before the MDX content!
        </code>
      </pre>
      <div style={{ border: '1px solid magenta' }}>
        We&apos;d keep this MDX content in place for Waypoint. We&apos;d need to
        strip the <code>H1</code>, remark plugin might actually be easiest since
        we already have additionalRemarkPlugins as an option to work with.
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
    additionalRemarkPlugins: [],
  })

const getStaticProps: GetStaticProps = async (context) => {
  // Our generatedGetStaticProps expects params, so we gotta pass em,
  // even though in this context we're not getting them from NextJS
  return await generatedGetStaticProps({ ...context, params: { page: [] } })
}

CustomDocsView.layout = SidebarSidecarLayout

export { getStaticProps }
export default CustomDocsView

import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import pageContent from './content.json'
import s from './style.module.css'

const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as ProductData

interface WaypointDocsLandingProps {
  mdxSource: MDXRemoteSerializeResult
}

// TODO: abstract the markup to a new view, such as RootDocsPathLandingView
const WaypointDocsLanding = ({ mdxSource }: WaypointDocsLandingProps) => {
  return (
    <ProductRootDocsPathLanding
      pageContent={pageContent}
      mdxSlot={
        <div className={s.waypointMDXWrapper}>
          <DocsView mdxSource={mdxSource} hideSearch />
        </div>
      }
    />
  )
}

const { getStaticProps: generatedGetStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
  })

/**
 * Wrapper for `generatedGetStaticProps`. Handles passing the correct `params`
 * property to `generatedGetStaticProps`.
 *
 * Also handles clearing the following `layoutProps` returned in the `props`
 * returned by `generatedGetStaticProps`: `githubFileUrl` and `sidecarSlot`.
 */
async function getStaticProps({ context }) {
  // TODO: remove the any
  const generatedProps = (await generatedGetStaticProps({
    ...context,
    params: { page: [] },
  })) as any

  generatedProps.props.layoutProps.githubFileUrl = null

  // TODO handle rendering the sidecar in a follow-up PR
  generatedProps.props.layoutProps.sidecarSlot = null

  return generatedProps
}

WaypointDocsLanding.layout = SidebarSidecarLayout
export { getStaticProps }
export default WaypointDocsLanding

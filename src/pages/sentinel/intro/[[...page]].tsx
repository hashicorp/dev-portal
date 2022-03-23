import { ReactElement } from 'react'
import sentinelData from 'data/sentinel.json'
import { Product } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { sentinelUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const basePathForLoader = 'sentinel/intro'
const baseName = 'Intro'
const product = sentinelData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SentinelIntroPage = ({ mdxSource }): ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  basePathForLoader,
  baseName,
  additionalRemarkPlugins: [sentinelUrlAdjuster],
})

SentinelIntroPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default SentinelIntroPage

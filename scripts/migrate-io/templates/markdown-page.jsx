import $$layoutName from '$$layoutPath'
import productData from 'data/$$productSlug.json'
import MarkdownPage from '@hashicorp/react-markdown-page'
import { isContentDeployPreview } from 'lib/env-checks'
import fetchContentApiFileString from 'lib/fetch-content-api-file-string'
import shimRemoteIncludes from 'lib/shim-remote-includes'
// imports below are used server-side only
import generateStaticProps from '@hashicorp/react-markdown-page/server'
import markdownPageStaticPropsFromString from 'lib/markdown-page-static-props-from-string'

function MarkdownPageView(staticProps) {
  return <MarkdownPage {...staticProps} />
}

export async function getStaticProps(ctx) {
  // If we're running alongside content, use local content
  const hasLocalContent = isContentDeployPreview(productData.slug)
  if (hasLocalContent) {
    return generateStaticProps({
      pagePath: '$$localFilePath',
    })(ctx)
  }
  // Otherwise, load the MDX content via our content API
  const mdxFileString = await fetchContentApiFileString({
    product: productData.slug,
    filePath: '$$remoteFilePath',
    version: '$$remoteVersion',
  })
  const withRemoteIncludes = await shimRemoteIncludes(
    mdxFileString,
    productData.slug
  )
  return await markdownPageStaticPropsFromString(withRemoteIncludes)()
}

// Export view with layout
MarkdownPageView.layout = $$layoutName
export default MarkdownPageView

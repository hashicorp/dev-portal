import { isObject, traverse } from 'lib/traverse'
import { ProductPageBlock as LearnClientProductPageBlock } from 'lib/learn-client/types'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductViewBlock } from '../components/product-view-content'
import { addHeadingSlugsToBlocks, buildLayoutHeadings } from './heading-helpers'
import detectAndReformatLearnUrl from './detect-and-reformat-learn-url'

/**
 * Fix up product tutorials view page data
 * before sending it to the client
 */
async function processPageData(rawPageData: {
  blocks: LearnClientProductPageBlock[]
  showProductSitemap?: boolean
}): Promise<{
  pageData: {
    blocks: ProductViewBlock[]
    showProductSitemap?: boolean
  }
  headings: TableOfContentsHeading[]
}> {
  const withHeadings = addHeadingSlugsToBlocks(rawPageData)
  const withFixedUrls = await fixBrandedCalloutUrls(withHeadings)
  const headings = buildLayoutHeadings(withFixedUrls)
  return { pageData: withFixedUrls, headings }
}

/**
 * Fix URLs in BrandedCallout blocks,
 * which may point to collection or tutorial URLs using the
 * learn.hashicorp.com URL structure.
 */
async function fixBrandedCalloutUrls(pageData: {
  blocks: ProductViewBlock[]
  showProductSitemap?: boolean
}): Promise<{
  blocks: ProductViewBlock[]
  showProductSitemap?: boolean
}> {
  return await traverse(
    pageData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_key: string | number | symbol, value: any) => {
      // We only want to deal with branded callouts, with a defined cta.url
      const isBrandedCallout =
        isObject(value) && value.type === 'BrandedCallout'
      if (!isBrandedCallout) {
        return value
      }
      const { cta } = value
      if (!isObject(cta) || typeof cta.url !== 'string') {
        return value
      }
      // Fix the url
      const correctedUrl = detectAndReformatLearnUrl(cta.url)
      return { ...value, cta: { ...cta, url: correctedUrl } }
    }
  )
}

export default processPageData

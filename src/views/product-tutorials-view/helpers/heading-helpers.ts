import slugify from 'slugify'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductPageBlock } from 'lib/learn-client/types'
import { ProductViewBlock } from '../components/product-view-content'

/**
 * Given pageData for product view,
 * as well as a productName,
 *
 * Return an array of Sidecar-compatible
 * TableOfContentsHeading objects, each representing
 * a section that will be rendered on the page.
 */
function buildLayoutHeadings(
  pageData: {
    blocks: ProductViewBlock[]
    showProductSitemap?: boolean
  },
  productName: string
): TableOfContentsHeading[] {
  const { blocks, showProductSitemap } = pageData

  /**
   * Build an <h1> overview heading
   */
  const overviewHeading = [getOverviewHeading(productName)]

  /**
   * Extract headings from each block
   */
  const blockHeadings = blocks.reduce(
    (acc: TableOfContentsHeading[], block: ProductViewBlock) => {
      if (block.type !== 'CardList') {
        acc.push({
          title: block.heading,
          slug: block.headingSlug,
          level: 2,
        })
      }
      return acc
    },
    []
  )

  /**
   * If there's a product sitemap, build add a heading item for it
   */
  const sitemapHeading = showProductSitemap ? [getSitemapHeading()] : []

  /**
   * Flatten the array of headings, and return them
   */
  return [...overviewHeading, ...blockHeadings, ...sitemapHeading]
}

/**
 * Given a productName,
 * return a TableOfContentsHeading object
 * representing a top-level heading for a product tutorials view
 */
function getOverviewHeading(productName: string): TableOfContentsHeading {
  return { title: `${productName} Tutorials`, slug: 'overview', level: 1 }
}

/**
 * Return a TableOfContentsHeading object
 * representing a heading for a sitemap section
 * on a product tutorials view
 */
function getSitemapHeading(): TableOfContentsHeading {
  return { title: 'All tutorials', slug: 'all-tutorials', level: 2 }
}

/**
 * Adds "headingSlug" properties to all blocks with defined "heading"
 */
function addHeadingSlugsToBlocks(rawPageData: {
  blocks: ProductPageBlock[]
  showProductSitemap?: boolean
}): {
  blocks: ProductViewBlock[]
  showProductSitemap?: boolean
} {
  const { blocks } = rawPageData
  const blocksWithHeadings = blocks.map((block: $TSFixMe) => {
    if (typeof block.heading === undefined) {
      return block
    }
    const headingSlug = slugify(block.heading, { lower: true })
    return { ...block, headingSlug }
  })
  // Return the page data with these new blocks
  return { ...rawPageData, blocks: blocksWithHeadings }
}

export {
  addHeadingSlugsToBlocks,
  buildLayoutHeadings,
  getOverviewHeading,
  getSitemapHeading,
}

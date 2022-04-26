import slugify from 'slugify'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductPageBlock } from 'lib/learn-client/types'
import { ProductViewBlock } from '../components/product-view-content'

function buildLayoutHeadings(
  pageData: {
    blocks: ProductViewBlock[]
    showProductSitemap?: boolean
  },
  productName: string
): TableOfContentsHeading[] {
  const { blocks, showProductSitemap } = pageData

  // Add an overview heading (will be visually hidden in the UI)
  const overviewHeading = [getOverviewHeading(productName)]

  // If there's a product sitemap, manually add a heading item for it
  const sitemapHeading = showProductSitemap ? [getSitemapHeading()] : []

  // Extract headings from each block
  const blockHeadings = blocks.reduce(
    (acc: TableOfContentsHeading[], block: ProductViewBlock) => {
      if (block.type !== 'CardList') {
        acc.push({
          title: block.heading,
          slug: block.headingSlug,
          level: 2, // TODO: is this used in Sidecar? Need to investigate
        })
      }
      return acc
    },
    []
  )

  return [...overviewHeading, ...blockHeadings, ...sitemapHeading]
}

function getOverviewHeading(productName: string): TableOfContentsHeading {
  return { title: `${productName} Tutorials`, slug: 'overview', level: 1 }
}

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
    return { ...block, headingSlug: slugify(block.heading, { lower: true }) }
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

import slugify from 'slugify'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductPageBlock as LearnClientProductPageBlock } from 'lib/learn-client/types'
import { ProductViewBlock } from '../components/product-view-content'

/**
 * Given pageData for product view,
 * as well as a productName,
 *
 * Return an array of Sidecar-compatible
 * TableOfContentsHeading objects, each representing
 * a section that will be rendered on the page.
 */
function buildLayoutHeadings(pageData: {
  blocks: ProductViewBlock[]
  showProductSitemap?: boolean
}): TableOfContentsHeading[] {
  const { blocks, showProductSitemap } = pageData

  /**
   * Build an <h1> overview heading
   */
  const overviewHeading = [getOverviewHeading()]

  /**
   * Extract headings from each block
   */
  const blockHeadings = blocks.reduce(
    (acc: TableOfContentsHeading[], block: ProductViewBlock) => {
      if (isReadyForTableOfContents(block)) {
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
 * Check if a block has a heading,
 * and is a block type we want to show in the table of contents,
 * in which case we can generate a headingSlug for it
 */
function isIntendedForTableOfContents<
  T extends { type: string; heading?: unknown }
>(block: T): block is T & { heading: string } {
  const isTargetType =
    block.type == 'CollectionsStack' ||
    block.type == 'FeaturedStack' ||
    block.type == 'TutorialsStack'
  return isTargetType && typeof block.heading == 'string'
}

/**
 * Check if a block can be added to the table of contents
 */
function isReadyForTableOfContents<
  T extends { type: string; headingSlug?: unknown }
>(block: T): block is T & { headingSlug: string } {
  return (
    isIntendedForTableOfContents(block) && typeof block.headingSlug == 'string'
  )
}

/**
 * Given a productName,
 * return a TableOfContentsHeading object
 * representing a top-level heading for a product tutorials view
 */
function getOverviewHeading(): TableOfContentsHeading {
  return { title: 'Overview', slug: 'overview', level: 1 }
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
  blocks: LearnClientProductPageBlock[]
  showProductSitemap?: boolean
}): {
  blocks: ProductViewBlock[]
  showProductSitemap?: boolean
} {
  const { blocks } = rawPageData
  const blocksWithHeadings = blocks.map(
    (block: LearnClientProductPageBlock) => {
      if (!isIntendedForTableOfContents(block)) {
        return block
      }
      const headingSlug = slugify(block.heading, { lower: true })
      return { ...block, headingSlug }
    }
  )
  // Return the page data with these new blocks
  return { ...rawPageData, blocks: blocksWithHeadings }
}

export {
  addHeadingSlugsToBlocks,
  buildLayoutHeadings,
  getOverviewHeading,
  getSitemapHeading,
}

import slugify from 'slugify'

function buildLayoutHeadings(
  pageData: $TSFixMe,
  productName: string
): $TSFixMe {
  const { blocks } = pageData

  // Add an overview heading (will be visually hidden in the UI)
  const overviewHeading = [getOverviewHeading(productName)]

  // If there's a product sitemap, manually add a heading item for it
  const sitemapHeading = pageData.showProductSitemap
    ? [getSitemapHeading()]
    : []

  // Extract headings from each block
  const blockHeadings = blocks.map((b) => ({
    title: b.heading,
    slug: b.headingSlug,
    level: 2, // TODO: is this used in Sidecar? Need to investigate
  }))

  return [...overviewHeading, ...blockHeadings, ...sitemapHeading]
}

function getOverviewHeading(productName: string): $TSFixMe {
  return { title: `${productName} Tutorials`, slug: 'overview', level: 1 }
}

function getSitemapHeading(): $TSFixMe {
  return { title: 'All tutorials', slug: 'all-tutorials', level: 2 }
}

function addHeadingSlugsToBlocks(rawPageData: $TSFixMe): $TSFixMe {
  // Add "headingSlug" properties to all blocks with defined "heading"
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

import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductLandingViewProps } from '../types'
import { ProductLandingBlock } from '../components/product-landing-blocks/types'

export function extractHeadings(
  content: ProductLandingViewProps['content']
): TableOfContentsHeading[] {
  /**
   * TODO: content is raw placeholder for now
   * - Need to add "headings" that aren't placeholders.
   *   These will be derived from content blocks
   *   (mainly heading blocks, but also others, based on design intent)
   * - Need to augment things like tutorialSlugs to fill in that data
   *   Will close: https://app.asana.com/0/1201010428539925/1201654639085764/f
   * - Need to build out the client-side components, whose props APIs will
   *   inform what content structure we'll want to return for use on the client.
   *   Intent being to return the minimum data necessary to render
   *   all content block components on the page.
   */
  const headings: TableOfContentsHeading[] = [
    {
      title: content.overview.heading,
      slug: content.overview.headingSlug,
      level: 2,
    },
    {
      title: content.get_started.heading,
      slug: content.get_started.headingSlug,
      level: 2,
    },
    ...content.blocks.reduce(
      (acc: TableOfContentsHeading[], b: ProductLandingBlock) => {
        if (b.type === 'heading') {
          acc.push({
            title: b.heading,
            slug: b.headingSlug,
            level: 2,
          })
        }
        return acc
      },
      []
    ),
  ]

  return headings
}

import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductLandingViewProps } from '../types'
import { ProductLandingBlock } from '../components/product-landing-blocks/types'

export function extractHeadings(
  content: ProductLandingViewProps['content']
): TableOfContentsHeading[] {
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

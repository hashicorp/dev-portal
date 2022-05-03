import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { SidebarProps } from 'components/sidebar'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductLandingContent, ProductLandingContentSchema } from './schema'
import { validateAgainstSchema } from './helpers'
import { EnrichedNavItem } from 'components/sidebar/types'

async function generateStaticProps({
  product,
  contentJsonFile,
}: {
  product: ProductData
  contentJsonFile: string
}): Promise<{
  content: ProductLandingContent
  layoutProps: {
    headings: TableOfContentsHeading[]
    breadcrumbLinks: BreadcrumbLink[]
    sidebarProps: SidebarProps
  }
  product: ProductData
}> {
  /**
   * Note: could consider other content sources. For now, JSON.
   * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
   */
  const jsonFilePath = path.join(process.cwd(), contentJsonFile)
  const CONTENT = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
  /**
   * Validate that CONTENT matches our schema. This includes a type guard,
   * to safely assert that CONTENT is ProductLandingContent.
   */
  validateAgainstSchema(CONTENT, ProductLandingContentSchema, jsonFilePath)

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
  const placeholderHeadings = [
    {
      title: `What is ${product.name}`,
      slug: 'placeholder-slug-1',
      level: 2,
    },
    {
      title: 'Getting Started',
      slug: 'placeholder-slug-2',
      level: 2,
    },
    {
      title: 'Use Cases',
      slug: 'placeholder-slug-3',
      level: 2,
    },
    {
      title: 'Case Studies',
      slug: 'placeholder-slug-4',
      level: 2,
    },
  ]

  /**
   * Gather up our static props package & return it
   */
  return {
    content: CONTENT,
    layoutProps: {
      headings: placeholderHeadings,
      breadcrumbLinks: [
        { title: 'Developer', url: '/' },
        { title: product.name, url: `/${product.slug}` },
      ],
      sidebarProps: {
        /**
         * TODO: we may need to map MenuItem entries to
         * EnrichedNavItem entries? For now, I've casted them
         * to sidestep the issue, but this is likely not
         * a good long-term solution. Related task:
         * https://app.asana.com/0/1202022787106807/1201602267333015/f
         */
        menuItems: [
          ...(product.sidebar
            .landingPageNavData as unknown as EnrichedNavItem[]),
          { divider: true },
          ...(product.sidebar.resourcesNavData as unknown as EnrichedNavItem[]),
        ],
        showFilterInput: false,
        title: product.name,
      },
    },
    product,
  }
}

export { generateStaticProps }
// eslint-disable-next-line import/no-anonymous-default-export
export default { generateStaticProps }

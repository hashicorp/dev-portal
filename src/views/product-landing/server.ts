import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { SidebarProps } from 'components/sidebar'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductLandingContent, ProductLandingContentSchema } from './schema'
import {
  validateAgainstSchema,
  transformRawContentToProp,
  extractHeadings,
} from './helpers'
import { EnrichedNavItem } from 'components/sidebar/types'
import { ProductLandingViewProps } from './types'

async function generateStaticProps({
  product,
  contentJsonFile,
}: {
  product: ProductData
  contentJsonFile: string
}): Promise<
  ProductLandingViewProps & {
    layoutProps: {
      headings: TableOfContentsHeading[]
      breadcrumbLinks: BreadcrumbLink[]
      sidebarProps: SidebarProps
    }
    product: ProductData
  }
> {
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
  const isValid = validateAgainstSchema<ProductLandingContent>(
    CONTENT,
    ProductLandingContentSchema,
    jsonFilePath
  )
  if (!isValid) {
    throw new Error('validateAgainstSchema should have thrown an error.')
  }

  /**
   * Transform content to props.
   * This includes filling in inline tutorials and collection content.
   */
  const content = await transformRawContentToProp(CONTENT, product)

  /**
   * Gather up our static props package & return it
   */
  return {
    content,
    product,
    layoutProps: {
      headings: extractHeadings(content),
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
  }
}

export { generateStaticProps }
// eslint-disable-next-line import/no-anonymous-default-export
export default { generateStaticProps }

import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
// import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { ProductLandingContent, ProductLandingContentSchema } from './schema'
import {
  validateAgainstSchema,
  transformRawContentToProp,
  extractHeadings,
} from './helpers'
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
      sidebarNavDataLevels: SidebarProps[]
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
   * which asserts that CONTENT is ProductLandingContent.
   */
  validateAgainstSchema<ProductLandingContent>(
    CONTENT,
    ProductLandingContentSchema,
    jsonFilePath
  )

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
      /**
       * @TODO remove casting to `any` (used $TSFixMe here for visibility).
       * This requires refactoring both `generateTopLevelSidebarNavData` and
       * `generateProductLandingSidebarNavData` to set up `menuItems` with the
       * correct types.
       * This is outside the scope of the product landing page content build,
       * so deferring to a sidebar-focused follow-up PR.
       */
      sidebarNavDataLevels: [
        generateTopLevelSidebarNavData(product.name),
        generateProductLandingSidebarNavData(product),
      ] as $TSFixMe,
    },
  }
}

export { generateStaticProps }
// eslint-disable-next-line import/no-anonymous-default-export
export default { generateStaticProps }

import { GetStaticPropsResult } from 'next'
import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { validateAgainstSchema } from 'lib/validate-against-schema'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { ProductLandingContent, ProductLandingContentSchema } from './schema'
import { transformRawContentToProp, extractHeadings } from './helpers'
import { ProductLandingViewProps } from './types'

const generateGetStaticProps = (product: ProductData) => {
	return async (): Promise<
		GetStaticPropsResult<
			ProductLandingViewProps & {
				layoutProps: {
					headings: TableOfContentsHeading[]
					breadcrumbLinks: BreadcrumbLink[]
					sidebarNavDataLevels: SidebarProps[]
				}
				product: ProductData
			}
		>
	> => {
		/**
		 * Note: could consider other content sources. For now, JSON.
		 * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
		 */
		const jsonFilePath = path.join(
			process.cwd(),
			`src/content/${product.slug}/product-landing.json`
		)
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
		 * Gather up our static props
		 */
		const props = stripUndefinedProperties({
			content,
			product,
			layoutProps: {
				headings: extractHeadings(content),
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{ title: product.name, url: `/${product.slug}`, isCurrentPage: true },
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
		})

		return {
			props,
			revalidate: false,
		}
	}
}

export { generateGetStaticProps }

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
	CollectionViewSidebarContent,
} from 'components/tutorials-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import s from './product-tutorials-view.module.css'

function ProductTutorialsView({
	data,
	layoutProps,
	product,
}: ProductTutorialsViewProps): React.ReactElement {
	const { pageData, sitemapCollections } = data
	const { showProductSitemap, blocks } = pageData

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			title: 'Tutorials',
			/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
			visuallyHideTitle: true,
			children: (
				<CollectionViewSidebarContent
					productSlug={product.slug}
					sections={layoutProps.sidebarSections}
				/>
			),
		},
	]

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			headings={layoutProps.headings}
			AlternateSidebar={TutorialsSidebar}
			/**
			 * @TODO remove casting to `any`. Will require refactoring both
			 * `generateTopLevelSidebarNavData` and
			 * `generateProductLandingSidebarNavData` to set up `menuItems` with the
			 * correct types. This will require chaning many files, so deferring for
			 * a follow-up PR since this is functional for the time being.
			 */
			sidebarNavDataLevels={sidebarNavDataLevels as any}
		>
			<ProductViewContent blocks={blocks} />
			{showProductSitemap ? (
				<div className={s.sitemap}>
					<ProductTutorialsSitemap
						collections={sitemapCollections}
						product={product.slug}
					/>
				</div>
			) : null}
		</SidebarSidecarLayout>
	)
}

ProductTutorialsView.contentType = 'tutorials'

export default ProductTutorialsView

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
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
import OptInOut from 'components/opt-in-out'
import { useOptInAnalyticsTracking } from 'hooks/use-opt-in-analytics-tracking'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'

function ProductTutorialsView({
	data,
	layoutProps,
	product,
}: ProductTutorialsViewProps): React.ReactElement {
	useOptInAnalyticsTracking('learn')
	const { inlineCollections, inlineTutorials, pageData, allCollections } = data
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
			overviewItemHref: `/${product.slug}/tutorials`,
			title: 'Tutorials',
			children: (
				<CollectionViewSidebarContent sections={layoutProps.sidebarSections} />
			),
		},
	]

	const PageHeading = () => {
		const { title, level, slug } = getOverviewHeading()
		return (
			<Heading
				id={slug}
				level={level}
				size={500}
				weight="bold"
				className={s.heading}
			>
				{title}
			</Heading>
		)
	}

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
			optInOutSlot={<OptInOut platform="learn" />}
		>
			<PageHeading />
			<ProductViewContent
				blocks={blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
			{showProductSitemap ? (
				<div className={s.sitemap}>
					<ProductTutorialsSitemap
						collections={allCollections}
						product={product.slug}
					/>
				</div>
			) : null}
		</SidebarSidecarLayout>
	)
}

ProductTutorialsView.contentType = 'tutorials'

export default ProductTutorialsView

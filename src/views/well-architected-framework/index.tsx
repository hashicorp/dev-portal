import slugify from 'slugify'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import HeroHeadingVisual from 'views/product-landing/components/hero-heading-visual'
import { SidebarProps } from 'components/sidebar'
import OverviewCta from 'views/product-landing/components/overview-cta'
import wafContent from 'content/well-architected-framework/index.json'
import s from './well-architected-framework-landing.module.css'

export const wafData = {
	slug: 'well-architected-framework',
	name: 'Well Architected Framework',
}

export default function WellArchitectedFrameworkLandingView(props) {
	const { data, layoutProps } = props
	const { pageData, inlineCollections, inlineTutorials } = data

	return (
		<SidebarSidecarLayout
			headings={layoutProps.headings}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
				layoutProps.sidebarSections,
			]}
		>
			<div className={s.hero}>
				<HeroHeadingVisual {...wafContent.landingPage.hero} />
			</div>
			<div className={s.overview}>
				<OverviewCta
					{...wafContent.landingPage.overview}
					headingSlug={slugify(wafContent.landingPage.overview.heading)}
				/>
			</div>
			<ProductViewContent
				blocks={pageData.blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
		</SidebarSidecarLayout>
	)
}

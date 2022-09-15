import slugify from 'slugify'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import HeroHeadingVisual from 'views/product-landing/components/hero-heading-visual'
import { SidebarProps } from 'components/sidebar'
import OverviewCta from 'views/product-landing/components/overview-cta'
import OptInOut from 'components/opt-in-out'
import { WellArchitectedFrameworkLandingProps } from './types'
import s from './well-architected-framework-landing.module.css'
import { generateWafCollectionSidebar } from './utils/generate-collection-sidebar'

export default function WellArchitectedFrameworkLandingView(
	props: WellArchitectedFrameworkLandingProps
) {
	const { data, layoutProps, metadata } = props
	const { hero, overview, blocks } = data.pageData

	return (
		<SidebarSidecarLayout
			headings={layoutProps.headings}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(metadata.name) as SidebarProps,
				generateWafCollectionSidebar(metadata, layoutProps.sidebarSections),
			]}
			optInOutSlot={<OptInOut platform="learn" />}
		>
			<div className={s.hero}>
				<HeroHeadingVisual {...hero} />
			</div>
			<div className={s.overview}>
				<OverviewCta {...overview} headingSlug={slugify(overview.heading)} />
			</div>
			<ProductViewContent
				blocks={blocks}
				inlineCollections={data.inlineCollections}
				inlineTutorials={data.inlineTutorials}
			/>
		</SidebarSidecarLayout>
	)
}

WellArchitectedFrameworkLandingView.contentType = 'tutorials'

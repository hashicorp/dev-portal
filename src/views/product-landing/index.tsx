import { ReactElement } from 'react'
import Sidebar, { SidebarProps } from 'components/sidebar'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CalloutCard from 'components/callout-card'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { developmentToast, ToastColor } from 'components/toast'
import { ProductLandingViewProps } from './types'
import { getIconCards } from './helpers'
import HeroHeadingVisual from './components/hero-heading-visual'
import OverviewCta from './components/overview-cta'
import ProductLandingBlocks from './components/product-landing-blocks'
import s from './product-landing.module.css'
import { TryHcpCalloutPrebuilt } from 'components/try-hcp-callout'
import { hasHcpCalloutContent } from 'components/try-hcp-callout/content'
import { SidebarBaseProps } from 'components/sidebar/types'
import { SidebarNavHighlightItem } from 'components/sidebar/components'

function ProductLandingView({
	content,
	product,
	layoutProps,
}: ProductLandingViewProps): ReactElement {
	const { hero, overview, overviewParagraph, get_started, blocks } = content
	const iconCards = getIconCards(product)

	if (overview.cta && overviewParagraph) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in ProductLandingView',
			description:
				'Both overview `cta` and `overviewParagraph` were passed to ProductLandingView. Only provide one.',
		})
	}

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			headings={layoutProps.headings}
			sidebarNavDataLevels={layoutProps.sidebarNavDataLevels as any}
			/**
			 * Note: all sidebarNavDataLevels contain menuItems, *except* the
			 * product landing level. For the product landing level (the level shown
			 * in the sidebar in larger viewports), we use AlternateSidebar to allow
			 * rendering of components in a more composition-friendly approach.
			 */
			AlternateSidebar={({
				isMobileMenuRendered,
				...restSidebarProps
			}: SidebarBaseProps & { isMobileMenuRendered?: boolean }) => {
				/**
				 * When in the mobile menu, we don't show the highlighted
				 * product overview item. We instead visible show the Sidebar's
				 * default and required rendered `title`.
				 *
				 * When outside the mobile menu, we show a highlighted product
				 * overview item. And we visually hide the sidebar title, as it
				 * would be visually redundant with our highlighted product item.
				 */
				const isNotMobileMenu = !isMobileMenuRendered

				return (
					<Sidebar {...restSidebarProps} visuallyHideTitle={isNotMobileMenu}>
						{isNotMobileMenu ? (
							<div style={{ border: '1px solid magenta' }}>
								<SidebarNavHighlightItem
									theme={product.slug}
									text={product.name}
									href={`/${product.slug}`}
								/>
							</div>
						) : null}
						<div style={{ border: '1px solid magenta' }}>
							Product landing sidebar menu items.
						</div>
					</Sidebar>
				)
			}}
		>
			<div className={s.heroMargin}>
				<HeroHeadingVisual
					heading={hero.heading}
					image={hero.image}
					productSlug={hero.productSlug}
				/>
			</div>
			{iconCards ? (
				<div className={s.iconCardsMargin}>
					<IconCardLinkGridList cards={iconCards} productSlug={product.slug} />
				</div>
			) : null}
			<div className={s.overviewCtaMargin}>
				<OverviewCta
					heading={overview.heading}
					headingSlug={overview.headingSlug}
					body={overview.body}
					cta={overview.cta}
					image={overview.image}
				/>
				{overviewParagraph ? (
					<p className={s.overviewParagraph}>{overviewParagraph}</p>
				) : null}
			</div>
			<div className={s.getStartedMargin}>
				<CalloutCard
					heading={get_started.heading}
					headingSlug={get_started.headingSlug}
					body={get_started.body}
					ctas={get_started.ctas}
					iconCardLinks={get_started.iconCardLinks}
					fixedColumns={get_started.fixedColumns}
				/>
			</div>
			{hasHcpCalloutContent(product.slug) ? (
				<div className={s.tryHcpCalloutMargin}>
					<TryHcpCalloutPrebuilt productSlug={product.slug} />
				</div>
			) : null}
			<ProductLandingBlocks blocks={blocks} />
		</SidebarSidecarLayout>
	)
}

// ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView

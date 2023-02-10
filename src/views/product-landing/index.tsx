import { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CalloutCard from 'components/callout-card'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { developmentToast, ToastColor } from 'components/toast'
import { TryHcpCalloutPrebuilt } from 'components/try-hcp-callout'
import { hasHcpCalloutContent } from 'components/try-hcp-callout/content'
import LandingPageBlocks from 'components/landing-page-blocks'
import { ProductLandingViewProps } from './types'
import { getIconCards } from './helpers'
import HeroHeadingVisual from './components/hero-heading-visual'
import OverviewCta from './components/overview-cta'
import s from './product-landing.module.css'

function ProductLandingView({
	content,
	product,
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
		<>
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
			<LandingPageBlocks blocks={blocks} />
		</>
	)
}

ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView

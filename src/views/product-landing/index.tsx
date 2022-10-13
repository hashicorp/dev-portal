import { ReactElement } from 'react'
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

function ProductLandingView({
	content,
	product,
}: ProductLandingViewProps): ReactElement {
	const { hero, overview, overviewParagraph, get_started, blocks } = content
	const iconCards = getIconCards(product.slug)

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
			<ProductLandingBlocks blocks={blocks} />
		</>
	)
}

ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView

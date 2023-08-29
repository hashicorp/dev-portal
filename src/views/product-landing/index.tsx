/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import { TryHcpCalloutPrebuilt } from 'components/try-hcp-callout'
import { hasHcpCalloutContent } from 'components/try-hcp-callout/content'
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
	layoutProps,
	outlineItems,
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
			{...layoutProps}
			sidecarSlot={<OutlineNavWithActive items={outlineItems} />}
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
			{get_started ? (
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
			) : null}
			{hasHcpCalloutContent(product.slug) ? (
				<div className={s.tryHcpCalloutMargin}>
					<TryHcpCalloutPrebuilt productSlug={product.slug} />
				</div>
			) : null}
			{blocks?.length > 0 ? <ProductLandingBlocks blocks={blocks} /> : null}
		</SidebarSidecarLayout>
	)
}

export default ProductLandingView

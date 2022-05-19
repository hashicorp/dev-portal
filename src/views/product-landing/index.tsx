/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { ProductLandingViewProps } from './types'
import { getIconCards } from './helpers'
import ProductLandingBlocks from './components/product-landing-blocks'
import HeroHeadingVisual from './components/hero-heading-visual'
import OverviewCta from './components/overview-cta'
import GetStartedCard from './components/get-started-card'
import s from './product-landing.module.css'

function ProductLandingView({
  content,
  product,
}: ProductLandingViewProps): ReactElement {
  const { hero, overview, get_started, blocks } = content

  const iconCards = getIconCards(product.slug)

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
      </div>
      <div className={s.getStartedMargin}>
        <GetStartedCard
          heading={get_started.heading}
          headingSlug={get_started.headingSlug}
          body={get_started.body}
          ctas={get_started.ctas}
        />
      </div>
      <ProductLandingBlocks blocks={blocks} />
    </>
  )
}

ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView

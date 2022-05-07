/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { ProductLandingViewProps } from './types'
import ProductLandingBlocks from './components/product-landing-blocks'
import HeroHeadingVisual from './components/hero-heading-visual'
import OverviewCta from './components/overview-cta'
import GetStartedCard from './components/get-started-card'
import IconCards, { getIconCards } from './components/icon-cards'

function ProductLandingView({
  content,
  product,
}: ProductLandingViewProps): ReactElement {
  const { hero, overview, get_started, blocks } = content

  const iconCards = getIconCards(product.slug)

  return (
    <>
      <HeroHeadingVisual
        heading={hero.heading}
        image={hero.image}
        productSlug={hero.productSlug}
      />
      {iconCards ? (
        <IconCards cards={iconCards} productSlug={product.slug} />
      ) : null}
      <OverviewCta
        heading={overview.heading}
        headingSlug={overview.headingSlug}
        body={overview.body}
        cta={overview.cta}
        image={overview.image}
      />
      <GetStartedCard
        heading={get_started.heading}
        headingSlug={get_started.headingSlug}
        body={get_started.body}
        ctas={get_started.ctas}
      />
      <ProductLandingBlocks blocks={blocks} />
    </>
  )
}

ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView

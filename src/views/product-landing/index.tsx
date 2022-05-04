/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { ProductLandingViewProps } from './types'
import ProductLandingBlocks from './components/product-landing-blocks'
import HeroHeadingVisual from './components/hero-heading-visual'
import OverviewCta from './components/overview-cta'
import GetStartedCard from './components/get-started-card'

function ProductLandingView({
  content,
}: ProductLandingViewProps): ReactElement {
  const { hero, overview, get_started, blocks } = content
  return (
    <>
      <HeroHeadingVisual
        heading={hero.heading}
        image={hero.image}
        productTheme={hero.productTheme}
      />
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

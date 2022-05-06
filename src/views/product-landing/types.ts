import { HeroHeadingVisualProps } from './components/hero-heading-visual/types'
import { OverviewCtaProps } from './components/overview-cta/types'
import { ProductLandingBlock } from './components/product-landing-blocks/types'
import { GetStartedCardProps } from './components/get-started-card/types'

export interface ProductLandingViewProps {
  content: {
    hero: HeroHeadingVisualProps
    overview: OverviewCtaProps
    get_started: GetStartedCardProps
    blocks: ProductLandingBlock[]
  }
}

import { ProductData } from 'types/products'
import { CalloutCardProps } from 'components/callout-card/types'
import { LandingPageBlock } from 'components/landing-page-blocks'
import { HeroHeadingVisualProps } from './components/hero-heading-visual/types'
import { OverviewCtaProps } from './components/overview-cta/types'

export interface ProductLandingViewProps {
	product: ProductData
	content: {
		hero: HeroHeadingVisualProps
		overview: OverviewCtaProps
		get_started: CalloutCardProps
		blocks: LandingPageBlock[]
		overviewParagraph?: string
	}
}

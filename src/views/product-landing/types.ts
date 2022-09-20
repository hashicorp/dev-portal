import { CalloutCardProps } from 'components/callout-card/types'
import { HeroHeadingVisualProps } from './components/hero-heading-visual/types'
import { OverviewCtaProps } from './components/overview-cta/types'
import { ProductLandingBlock } from './components/product-landing-blocks/types'
import { ProductData } from 'types/products'

export interface ProductLandingViewProps {
	product: ProductData
	content: {
		hero: HeroHeadingVisualProps
		overview: OverviewCtaProps
		get_started: CalloutCardProps
		blocks: ProductLandingBlock[]
		overviewParagraph?: string
	}
}

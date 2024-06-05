/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CalloutCardProps } from 'components/callout-card/types'
import { HeroHeadingVisualProps } from './components/hero-heading-visual/types'
import { OverviewCtaProps } from './components/overview-cta/types'
import { ProductLandingBlock } from './components/product-landing-blocks/types'
import { ProductData } from 'types/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { OutlineLinkItem } from 'components/outline-nav/types'

export interface ProductLandingViewProps {
	product: ProductData
	outlineItems: OutlineLinkItem[]
	layoutProps: Omit<SidebarSidecarLayoutProps, 'children'>
	content: {
		hero: HeroHeadingVisualProps
		overview: OverviewCtaProps
		get_started: CalloutCardProps
		blocks: ProductLandingBlock[]
		overviewParagraph?: string
	}
}

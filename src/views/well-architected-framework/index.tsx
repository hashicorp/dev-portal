/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import DocsViewLayout from 'layouts/docs-view-layout'
import HeroHeadingVisual from 'views/product-landing/components/hero-heading-visual'
import OverviewCta from 'views/product-landing/components/overview-cta'
import { ProductRootDocsPathLandingProps } from './types'
import {
	ProductRootDocsPathLandingMarketingContent,
} from './components'
import s from './product-root-docs-path-landing.module.css'

export default function WellArchitectedFrameworkLandingView(
	props: ProductRootDocsPathLandingProps
) {
	const { pageContent, layoutProps, outlineItems } = props
	const { marketingContentBlocks, hero, overview } = pageContent

	return (
		<DocsViewLayout {...layoutProps} outlineItems={outlineItems}>
			<div className={s.hero}>
				<HeroHeadingVisual {...hero} />
			</div>
			<div className={s.overview}>
				<OverviewCta
					{...overview}
					headingSlug={slugify(overview.heading, { lower: true })}
				/>
			</div>
			<ProductRootDocsPathLandingMarketingContent
				blocks={marketingContentBlocks}
			/>
		</DocsViewLayout>
	)
}

export type { ProductRootDocsPathLandingProps }

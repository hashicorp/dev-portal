/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import DocsViewLayout from 'layouts/docs-view-layout'
import HeroHeadingVisual from 'views/product-landing/components/hero-heading-visual'
import OverviewCta from 'views/product-landing/components/overview-cta'
import { ProductRootDocsPathLandingMarketingContent } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingProps } from './types'

export default function ValidatedDesignsLandingView(
	props: ProductRootDocsPathLandingProps
) {
	const { pageContent, layoutProps, outlineItems } = props
	const { marketingContentBlocks, hero, overview } = pageContent

	return (
		<DocsViewLayout {...layoutProps} outlineItems={outlineItems}>
			{hero ? <HeroHeadingVisual {...hero} /> : null}
			{overview ? (
				<OverviewCta
					{...overview}
					headingSlug={slugify(overview.heading, { lower: true })}
				/>
			) : null}
			<ProductRootDocsPathLandingMarketingContent
				blocks={marketingContentBlocks}
			/>
		</DocsViewLayout>
	)
}

export type { ProductRootDocsPathLandingProps }

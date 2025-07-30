/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import DocsViewLayout from 'layouts/docs-view-layout'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'
import DevDotContent from 'components/dev-dot-content'
import { ProductRootDocsPathLandingProps } from './types'
import {
	ProductRootDocsPathLandingHero,
	ProductRootDocsPathLandingMarketingContent,
} from './components'
import docsViewStyles from 'views/docs-view/docs-view.module.css'
import s from './product-root-docs-path-landing.module.css'

const ProductRootDocsPathLanding = ({
	mdxSource,
	pageContent,
	pageHeading,
	product,
	versions,
	layoutProps,
	outlineItems,
}: ProductRootDocsPathLandingProps) => {
	const { pageSubtitle, marketingContentBlocks } = pageContent

	let mdxSlot: ReactElement
	if (mdxSource) {
		const docsMdxComponents = getDocsMdxComponents(product.slug)
		const classes = classNames(
			s[`${product.slug}MDXWrapper`],
			s.mdxSlotWrapper,
			/**
			 * TODO: docsViewStyles.mdxContent might make sense to apply to
			 * DevDotContent, since the related concerns (iframe overflow, and
			 * removing the margin off the first item) seem to come up everywhere
			 * that DevDotContent is used.
			 * Task:
			 * https://app.asana.com/0/1202097197789424/1204107433878314/f
			 */
			docsViewStyles.mdxContent
		)
		mdxSlot = (
			<div className={classes}>
				<DevDotContent
					mdxRemoteProps={{
						...mdxSource,
						components: {
							...docsMdxComponents,
						},
					}}
				/>
			</div>
		)
	}

	return (
		<DocsViewLayout {...layoutProps} outlineItems={outlineItems}>
			<div className={versions ? s.docsLandingWithVersions : null}>
				<ProductRootDocsPathLandingHero
					pageHeading={pageHeading}
					pageSubtitle={pageSubtitle}
					iconCardGridItems={pageContent.iconCardGridItems}
					versions={versions}
				/>
				<ProductRootDocsPathLandingMarketingContent
					blocks={marketingContentBlocks}
				/>
				{mdxSlot}
			</div>
		</DocsViewLayout>
	)
}

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding

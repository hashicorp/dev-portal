/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import SidebarSidecarWithToc from 'layouts/sidebar-sidecar-with-toc'
import DocsVersionAlertBanner from 'components/docs-version-alert'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import DevDotContent from 'components/dev-dot-content'
import DocsVersionSwitcher from 'components/docs-version-switcher'
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
}: ProductRootDocsPathLandingProps) => {
	const { pageSubtitle, marketingContentBlocks } = pageContent
	const showProductDocsSearch =
		!__config.flags.enable_global_search &&
		__config.flags.enable_product_docs_search

	let mdxSlot: ReactElement
	if (mdxSource) {
		const docsMdxComponents = getDocsMdxComponents(product.slug)
		const classes = classNames(
			s[`${product.slug}MDXWrapper`],
			s.mdxSlotWrapper,
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
		<SidebarSidecarWithToc
			{...layoutProps}
			alertBannerSlot={<DocsVersionAlertBanner />}
		>
			<div className={versions ? s.docsLandingWithVersions : null}>
				{showProductDocsSearch && <ProductDocsSearch />}
				{versions ? (
					<div
						className={classNames(
							s.versionSwitcherWrapper,
							showProductDocsSearch && s.hasSearch
						)}
					>
						<DocsVersionSwitcher options={versions} />
					</div>
				) : null}
				<ProductRootDocsPathLandingHero
					pageHeading={pageHeading}
					pageSubtitle={pageSubtitle}
					iconCardGridItems={pageContent.iconCardGridItems}
				/>
				<ProductRootDocsPathLandingMarketingContent
					blocks={marketingContentBlocks}
				/>
				{mdxSlot}
			</div>
		</SidebarSidecarWithToc>
	)
}

ProductRootDocsPathLanding.contentType = 'docs'

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding

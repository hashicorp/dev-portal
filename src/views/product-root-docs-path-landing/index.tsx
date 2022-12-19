import { ReactElement } from 'react'
import classNames from 'classnames'
import DocsViewLayout from 'layouts/docs-view-layout'
import DocsView from 'views/docs-view'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import { ProductRootDocsPathLandingProps } from './types'
import {
	ProductRootDocsPathLandingHero,
	ProductRootDocsPathLandingMarketingContent,
} from './components'
import s from './product-root-docs-path-landing.module.css'

const ProductRootDocsPathLanding = ({
	mdxSource,
	pageContent,
	pageHeading,
	product,
	versions,
}: ProductRootDocsPathLandingProps) => {
	const { pageSubtitle, marketingContentBlocks } = pageContent
	const showProductDocsSearch =
		!__config.flags.enable_global_search &&
		__config.flags.enable_product_docs_search

	let mdxSlot: ReactElement
	if (mdxSource) {
		const classes = classNames(s[`${product.slug}MDXWrapper`], s.mdxSlotWrapper)
		mdxSlot = (
			<div className={classes}>
				<DocsView mdxSource={mdxSource} hideSearch />
			</div>
		)
	}

	return (
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
	)
}

ProductRootDocsPathLanding.contentType = 'docs'
ProductRootDocsPathLanding.layout = DocsViewLayout

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding

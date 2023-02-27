/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import DocsViewLayout from 'layouts/docs-view-layout'
import DevDotContent from 'components/dev-dot-content'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import { DocsViewProps } from './types'
import { NoIndexTagIfVersioned } from './components/no-index-tag-if-versioned'
import ProductDocsSearch from './components/product-docs-search'
import getDocsMdxComponents from './utils/get-docs-mdx-components'
import s from './docs-view.module.css'

/**
 * Layouts
 *
 * Note: layout in frontmatter is not supported yet, this is early stage work.
 * Asana task: https://app.asana.com/0/1202097197789424/1202850056121889/f
 *
 * Note: this layout logic is used for non-`/docs` landing pages.
 * The `/docs` landing pages use `ProductRootDocsPathLanding`.
 * We could consider this approach, as it implies arbitrary layouts
 * are supported via frontmatter. We could also consider renaming the
 * "layout" property to something like "contentLayout", as otherwise
 * it seems like it could be confused with broader "src/layouts" code.
 * Task: https://app.asana.com/0/1202097197789424/1204069295311480/f
 */
const layouts = {
	'docs-root-landing': dynamic(() => import('./components/docs-root-landing')),
}
const DefaultLayout = ({ children }) => (
	<div className={s.mdxContent}>{children}</div>
)

const DocsView = ({
	metadata,
	mdxSource,
	lazy,
	hideSearch = false,
	versions,
	projectName,
	layoutProps,
	outlineItems,
}: DocsViewProps) => {
	const currentProduct = useCurrentProduct()
	const { compiledSource, scope } = mdxSource
	const docsMdxComponents = getDocsMdxComponents(currentProduct.slug)
	const shouldRenderSearch =
		!__config.flags.enable_global_search &&
		!hideSearch &&
		__config.flags.enable_product_docs_search

	const Layout = layouts[metadata?.layout?.name] ?? DefaultLayout

	/**
	 * TODO: figure out where non-iterable outlineItems are coming from,
	 * and address that server side.
	 */
	const isOutlineItemsArray = Array.isArray(outlineItems)
	const safeOutlineItems = isOutlineItemsArray ? outlineItems : []
	if (!isOutlineItemsArray) {
		console.log({
			message: 'UNSAFE OUTLINE ITEMS',
			productSlug: currentProduct.slug,
			breadcrumbs: layoutProps.breadcrumbLinks.map((b) => b.title),
			outlineItems,
		})
	}

	return (
		<DocsViewLayout {...layoutProps} outlineItems={safeOutlineItems}>
			<div className={classNames(versions && s.contentWithVersions)}>
				{shouldRenderSearch ? <ProductDocsSearch /> : null}
				{versions ? (
					<div className={s.versionSwitcherWrapper}>
						<DocsVersionSwitcher options={versions} projectName={projectName} />
					</div>
				) : null}
				<NoIndexTagIfVersioned />
				<DevDotContent
					mdxRemoteProps={{
						compiledSource,
						lazy,
						scope,
						components: {
							...docsMdxComponents,
							wrapper: (props) => <Layout {...props} {...metadata?.layout} />,
						},
					}}
				/>
			</div>
		</DocsViewLayout>
	)
}

DocsView.contentType = 'docs'

export type { DocsViewProps }
export default DocsView

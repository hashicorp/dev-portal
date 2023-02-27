/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import DocsVersionAlertBanner from 'components/docs-version-alert'
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
 * note: layout in frontmatter is not supported yet, this is early stage work.
 * Asana task: https://app.asana.com/0/1202097197789424/1202850056121889/f
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

	return (
		<SidebarSidecarLayout
			{...layoutProps}
			sidecarSlot={<OutlineNavWithActive items={outlineItems} />}
			alertBannerSlot={<DocsVersionAlertBanner />}
		>
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
		</SidebarSidecarLayout>
	)
}

DocsView.contentType = 'docs'

export type { DocsViewProps }
export default DocsView

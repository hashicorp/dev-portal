/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { useRouter } from 'next/router'
import { useCurrentProduct } from 'contexts'
import classNames from 'classnames'
import { getVersionFromPath } from 'lib/get-version-from-path'
import DocsViewLayout from 'layouts/docs-view-layout'
import DevDotContent from 'components/dev-dot-content'
import NoIndexTagIfVersioned from 'components/no-index-tag-if-versioned'
import { DocsViewProps } from './types'
import DocsPageHeading from './components/docs-page-heading'
import getDocsMdxComponents from './utils/get-docs-mdx-components'
import s from './docs-view.module.css'
import LandingHero from 'components/landing-hero'
import DocsPlainPageHeading from './components/docs-plain-page-heading'
import DocsVersionSwitcher from 'components/docs-version-switcher'

/**
 * Layouts
 *
 * Note: layout in frontmatter is not fully supported yet.
 * Asana task: https://app.asana.com/0/1202097197789424/1202850056121889/f
 *
 * Note: layout adjustments may make sense to adjust in `getStaticProps` logic,
 * rather than adjust during render. For example, this could could give us
 * more granular and efficient control over processing markdown and extracting
 * or replacing specific elements.
 * Task: https://app.asana.com/0/1202097197789424/1204069295311480/f
 *
 * For now, we're kind of imitating the proposed layouts-in-frontmatter approach
 * by setting `docs-root-landing` in `get-custom-layout.ts`, detecting that
 * here, and rendering a slightly different page heading as a result.
 */
function isDocsRootLandingLayout(layoutData) {
	return layoutData?.name === 'docs-root-landing'
}

const DocsView = ({
	metadata,
	mdxSource,
	versions,
	projectName,
	layoutProps,
	outlineItems,
	pageHeading,
}: DocsViewProps) => {
	const { asPath } = useRouter()
	const currentProduct = useCurrentProduct()
	const { compiledSource, scope } = mdxSource
	const docsMdxComponents = getDocsMdxComponents(currentProduct.slug)

	/**
	 * Check if we have a `pageHeading` to render. The `DocsPageHeading` element
	 * is used on nearly all docs pages, to render a heading element alongside an
	 * optional version selector. On docs "landing" pages, the heading element
	 * takes on additional styles (see `LandingHero`).
	 *
	 * The one use case where we don't have this is for Packer plugin docs,
	 * which uses this `DocsView` component directly but uses `docs-view/server`
	 * indirectly, with some other modifications, such as adding badges above the
	 * page heading. Packer plugins MDX processing does _not_ remove the `<h1 />`
	 * from MDX content, so we do not want to render a duplicative
	 * `DocsPageHeading` `h1` element.
	 *
	 * The Packer plugins use case will fade away after Integrations work,
	 * at which point we can always safely render <DocsPageHeading />.
	 * Task: https://app.asana.com/0/1202097197789424/1204412156894157/f
	 */
	const renderPageHeadingOutsideMdx = pageHeading?.id && pageHeading?.title
	const hasLandingHero = isDocsRootLandingLayout(metadata.layout)
	// For `docs-root-landing` layouts, use <LandingHero /> as the heading element
	let headingSlot
	if (hasLandingHero) {
		headingSlot = (
			<LandingHero
				pageHeading={pageHeading}
				pageSubtitle={metadata?.layout?.subtitle}
			/>
		)
	} else if (renderPageHeadingOutsideMdx) {
		headingSlot = (
			<DocsPlainPageHeading id={pageHeading.id} title={pageHeading.title} />
		)
	}

	return (
		<DocsViewLayout
			{...layoutProps}
			outlineItems={outlineItems}
			versions={versions}
		>
			{renderPageHeadingOutsideMdx ? (
				<DocsPageHeading
					className={classNames(s.docsPageHeading, {
						[s.hasLandingHero]: hasLandingHero,
					})}
					versionSelectorSlot={
						versions && versions.length > 0 ? (
							<DocsVersionSwitcher
								options={versions}
								projectName={projectName}
							/>
						) : null
					}
					headingSlot={headingSlot}
				/>
			) : null}
			<NoIndexTagIfVersioned isVersioned={!!getVersionFromPath(asPath)} />
			<DevDotContent
				mdxRemoteProps={{
					compiledSource,
					scope,
					components: {
						...docsMdxComponents,
						wrapper: (props) => <div className={s.mdxContent} {...props} />,
					},
				}}
			/>
		</DocsViewLayout>
	)
}

export type { DocsViewProps }
export default DocsView

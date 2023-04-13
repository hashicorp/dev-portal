/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { useCurrentProduct } from 'contexts'
import DocsViewLayout from 'layouts/docs-view-layout'
import DevDotContent from 'components/dev-dot-content'
import { DocsViewProps } from './types'
import DocsPageHeading from './components/docs-page-heading'
import { NoIndexTagIfVersioned } from './components/no-index-tag-if-versioned'
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
function checkHasLandingHero(layoutData) {
	return layoutData?.name === 'docs-root-landing'
}

const DocsView = ({
	metadata,
	mdxSource,
	lazy,
	versions,
	projectName,
	layoutProps,
	outlineItems,
	pageHeading,
}: DocsViewProps) => {
	const currentProduct = useCurrentProduct()
	const { compiledSource, scope } = mdxSource
	const docsMdxComponents = getDocsMdxComponents(currentProduct.slug)

	const hasPageHeading = pageHeading?.id && pageHeading?.title
	const hasLandingHero = checkHasLandingHero(metadata.layout)

	return (
		<DocsViewLayout {...layoutProps} outlineItems={outlineItems}>
			{/* Render the DocsPageHeading, but only if we have the pageHeading
			    prop available. The one use case where we don't have this is for
					Packer plugin docs, which uses this `DocsView` component directly
					but uses `docs-view/server` indirectly, with some other modifications,
					such as add badges above the page heading. Packer plugins MDX
					processing does _not_ remove the `<h1 />` from MDX content, so we
					do not want to render a duplicative `DocsPageHeading` `h1` element.

					The Packer plugins use case will fade away after Integrations work,
					at which point we can always safely render <DocsPageHeading />. */}
			{hasPageHeading ? (
				<DocsPageHeading
					hasLandingHero={hasLandingHero}
					subtitle={metadata?.layout?.subtitle}
					pageHeading={pageHeading}
					versions={versions}
					projectName={projectName}
				/>
			) : null}
			<NoIndexTagIfVersioned />
			<DevDotContent
				mdxRemoteProps={{
					compiledSource,
					lazy,
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

DocsView.contentType = 'docs'

export type { DocsViewProps }
export default DocsView

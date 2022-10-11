import dynamic from 'next/dynamic'
import { MDXRemote } from 'next-mdx-remote'
import { useCurrentProduct } from 'contexts'
import DocsViewLayout from 'layouts/docs-view-layout'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import DevDotContent from 'components/dev-dot-content'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import { DocsViewProps, ProductsToPrimitivesMap } from './types'
import { NoIndexTagIfVersioned } from './components/no-index-tag-if-versioned'
import ProductDocsSearch from './components/product-docs-search'
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

// Author primitives
const Badge = dynamic(() => import('components/author-primitives/shared/badge'))
const BadgesHeader = dynamic(
	() => import('components/author-primitives/packer/badges-header')
)
const Button = dynamic(
	() => import('components/author-primitives/shared/button')
)
const Checklist = dynamic(
	() => import('components/author-primitives/packer/checklist')
)
const Columns = dynamic(
	() => import('components/author-primitives/vault/columns')
)
const ConfigEntryReference = dynamic(
	() => import('components/author-primitives/consul/config-entry-reference')
)
const InlineTag = dynamic(
	() => import('components/author-primitives/vault/inline-tag')
)
const NestedNode = dynamic(
	() => import('components/author-primitives/waypoint/nested-node')
)
const Placement = dynamic(
	() => import('components/author-primitives/shared/placement-table')
)
const PluginBadge = dynamic(
	() => import('components/author-primitives/packer/plugin-badge')
)
const ProviderTable = dynamic(
	() => import('components/author-primitives/terraform/provider-table')
)
const SentinelEmbedded = dynamic(
	() => import('@hashicorp/react-sentinel-embedded')
)

const HCPCallout = dynamic(
	() => import('components/dev-dot-content/mdx-components/mdx-hcp-callout')
)

const productsToPrimitives: ProductsToPrimitivesMap = {
	boundary: null,
	consul: { ConfigEntryReference },
	hcp: { HCPCallout },
	nomad: { Placement },
	packer: { Badge, BadgesHeader, Checklist, PluginBadge },
	sentinel: { SentinelEmbedded },
	terraform: { ProviderTable },
	vagrant: { Button },
	vault: { Columns, Tag: InlineTag },
	waypoint: { NestedNode, Placement },
}

const DocsView = ({
	metadata,
	mdxSource,
	lazy,
	hideSearch = false,
	versions,
	projectName,
}: DocsViewProps) => {
	const currentProduct = useCurrentProduct()
	const { compiledSource, scope } = mdxSource
	const additionalComponents = productsToPrimitives[currentProduct.slug] || {}
	const components = defaultMdxComponents({ additionalComponents })
	const shouldRenderSearch =
		!__config.flags.enable_global_search &&
		!hideSearch &&
		__config.flags.enable_product_docs_search

	const Layout = layouts[metadata?.layout?.name] ?? DefaultLayout

	return (
		<>
			{shouldRenderSearch ? <ProductDocsSearch /> : null}
			<DevDotContent className={versions ? s.contentWithVersions : null}>
				{versions ? (
					<div className={s.versionSwitcherWrapper}>
						<DocsVersionSwitcher options={versions} projectName={projectName} />
					</div>
				) : null}
				<NoIndexTagIfVersioned />
				<MDXRemote
					compiledSource={compiledSource}
					components={{
						...components,
						wrapper: (props) => <Layout {...props} {...metadata?.layout} />,
					}}
					lazy={lazy}
					scope={scope}
				/>
			</DevDotContent>
		</>
	)
}

DocsView.contentType = 'docs'
DocsView.layout = DocsViewLayout

export type { DocsViewProps }
export default DocsView

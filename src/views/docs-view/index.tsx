import dynamic from 'next/dynamic'
import { MDXRemote } from 'next-mdx-remote'
import { useCurrentProduct } from 'contexts'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import TabProvider from 'components/tabs/provider'
import DevDotContent from 'components/dev-dot-content'
import { DocsViewProps, ProductsToPrimitivesMap } from './types'
import { NoIndexTagIfVersioned } from './components/no-index-tag-if-versioned'
import ProductDocsSearch from './components/product-docs-search'
import DocsViewLayout from 'layouts/docs-view-layout'

// Author primitives
const Badge = dynamic(() => import('components/author-primitives/packer/badge'))
const BadgesHeader = dynamic(
	() => import('components/author-primitives/packer/badges-header')
)
const Button = dynamic(() => import('@hashicorp/react-button'))
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

const productsToPrimitives: ProductsToPrimitivesMap = {
	boundary: null,
	consul: { ConfigEntryReference },
	hcp: null,
	nomad: { Placement },
	packer: { Badge, BadgesHeader, Checklist, PluginBadge },
	sentinel: { SentinelEmbedded },
	terraform: { ProviderTable },
	vagrant: { Button },
	vault: { Columns, Tag: InlineTag },
	waypoint: { NestedNode, Placement },
}

const DocsView = ({ mdxSource, lazy, hideSearch = false }: DocsViewProps) => {
	const currentProduct = useCurrentProduct()
	const { compiledSource, scope } = mdxSource
	const additionalComponents = productsToPrimitives[currentProduct.slug] || {}
	const components = defaultMdxComponents({ additionalComponents })
	const shouldRenderSearch =
		!hideSearch && __config.flags.enable_product_docs_search

	return (
		<>
			{shouldRenderSearch ? <ProductDocsSearch /> : null}
			<DevDotContent>
				<NoIndexTagIfVersioned />
				<TabProvider>
					<MDXRemote
						compiledSource={compiledSource}
						components={components}
						lazy={lazy}
						scope={scope}
					/>
				</TabProvider>
			</DevDotContent>
		</>
	)
}

DocsView.layout = DocsViewLayout

export type { DocsViewProps }
export default DocsView

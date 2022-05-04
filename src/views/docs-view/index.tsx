import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { MDXRemote } from 'next-mdx-remote'
import { useCurrentProduct } from 'contexts'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import TabProvider from 'components/tabs/provider'
import DevDotContent from 'components/dev-dot-content'
import { DocsViewProps, ProductsToPrimitivesMap } from './types'
import { NoIndexTagIfVersioned } from './components/no-index-tag-if-versioned'
import ProductDocsSearch from './components/product-docs-search'

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

function DocsViewMdxContent({ mdxSource, lazy }: DocsViewProps) {
  const currentProduct = useCurrentProduct()
  const { compiledSource, scope } = mdxSource
  const additionalComponents = productsToPrimitives[currentProduct.slug] || {}
  const components = defaultMdxComponents({ additionalComponents })

  return (
    <DevDotContent>
      <TabProvider>
        <MDXRemote
          compiledSource={compiledSource}
          components={components}
          lazy={lazy}
          scope={scope}
        />
      </TabProvider>
    </DevDotContent>
  )
}

function DocsViewInner({ children }: { children: ReactNode }) {
  return (
    <>
      {__config.flags.enable_product_docs_search ? <ProductDocsSearch /> : null}
      <NoIndexTagIfVersioned />
      {children}
    </>
  )
}

const DocsView = ({ mdxSource, lazy }: DocsViewProps) => {
  return (
    <DocsViewInner>
      <DocsViewMdxContent mdxSource={mdxSource} lazy={lazy} />
    </DocsViewInner>
  )
}

DocsView.layout = SidebarSidecarLayout

export type { DocsViewProps }
export { DocsViewInner, DocsViewMdxContent }
export default DocsView

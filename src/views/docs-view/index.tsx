import { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useCurrentProduct } from 'contexts'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

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

const productsToAdditionalComponents = {
  consul: { ConfigEntryReference },
  nomad: { Placement },
  packer: { Badge, BadgesHeader, Checklist, PluginBadge },
  sentinel: { SentinelEmbedded },
  terraform: { ProviderTable },
  vagrant: { Button },
  vault: {
    Columns,
    Tag: InlineTag,
  },
  waypoint: {
    NestedNode,
    Placement,
  },
}

export interface DocsViewProps {
  mdxSource: MDXRemoteSerializeResult
  lazy?: boolean
}

const DocsView = ({ mdxSource, lazy }: DocsViewProps): ReactElement => {
  const currentProduct = useCurrentProduct()
  const { compiledSource, scope } = mdxSource
  const additionalComponents =
    productsToAdditionalComponents[currentProduct.slug] || {}
  const components = defaultMdxComponents({ additionalComponents })
  return (
    <MDXRemote {...{ compiledSource, scope, lazy }} components={components} />
  )
}

DocsView.layout = SidebarSidecarLayout

export default DocsView

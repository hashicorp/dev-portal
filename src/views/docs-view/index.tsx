import { ReactElement } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useCurrentProduct } from 'contexts'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

// Author primitives
import Badge from 'components/author-primitives/packer/badge'
import BadgesHeader from 'components/author-primitives/packer/badges-header'
import Button from '@hashicorp/react-button'
import Checklist from 'components/author-primitives/packer/checklist'
import Columns from 'components/author-primitives/vault/columns'
import ConfigEntryReference from 'components/author-primitives/consul/config-entry-reference'
import InlineTag from 'components/author-primitives/vault/inline-tag'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import Placement from 'components/author-primitives/shared/placement-table'
import PluginBadge from 'components/author-primitives/packer/plugin-badge'
import ProviderTable from 'components/author-primitives/terraform/provider-table'
import SentinelEmbedded from '@hashicorp/react-sentinel-embedded'

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

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { ProductSlug } from 'types/products'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'

/**
 * Author primitives
 */
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

const productsToPrimitives: Record<
	ProductSlug,
	Record<string, ComponentType>
> = {
	boundary: null,
	consul: { ConfigEntryReference },
	hcp: { HCPCallout },
	nomad: { Placement },
	packer: { Badge, BadgesHeader, Checklist, PluginBadge },
	sentinel: { SentinelEmbedded },
	terraform: { ProviderTable },
	vagrant: { Button },
	vault: { Columns, Tag: InlineTag },
	waypoint: { Placement },
}

function getDocsMdxComponents(productSlug: ProductSlug) {
	const additionalComponents = productsToPrimitives[productSlug] || {}
	return defaultMdxComponents({ additionalComponents })
}

export default getDocsMdxComponents

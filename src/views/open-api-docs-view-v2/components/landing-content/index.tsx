/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import ProductIcon from 'components/product-icon'
import StandaloneLink from '@components/standalone-link'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
// Local
import { Status } from './components/status'
import { DescriptionMdx } from './components/description-mdx'
// Types
import type { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import type { StatusIndicatorConfig } from 'views/open-api-docs-view-v2/types'

import type { ProductSlug } from 'types/products'
// Styles
import s from './style.module.css'

export interface LandingContentProps {
	badgeText: string
	descriptionMdx?: MDXRemoteSerializeResult
	heading: string
	serviceProductSlug: ProductSlug
	statusIndicatorConfig?: StatusIndicatorConfig
	schemaFileString: string
}

export function LandingContent({
	badgeText,
	descriptionMdx,
	heading,
	serviceProductSlug,
	statusIndicatorConfig,
	schemaFileString,
}: LandingContentProps) {
	return (
		<div className={s.overviewWrapper}>
			<div className={s.headerAndVersionSwitcher}>
				<header className={s.header}>
					<IconTile size="medium" className={s.icon}>
						<ProductIcon productSlug={serviceProductSlug} />
					</IconTile>
					<span>
						<h1 className={s.heading}>{heading}</h1>
						{statusIndicatorConfig ? (
							<Status
								endpointUrl={statusIndicatorConfig.endpointUrl}
								pageUrl={statusIndicatorConfig.pageUrl}
							/>
						) : null}
					</span>
					<Badge
						className={s.releaseStageBadge}
						text={badgeText}
						type="outlined"
						size="small"
					/>
				</header>
			</div>
			{descriptionMdx ? (
				<DescriptionMdx mdxRemoteProps={descriptionMdx} />
			) : null}
			<StandaloneLink
				text="Download Spec"
				icon={<IconDownload16 />}
				iconPosition="leading"
				download="hcp.swagger.json"
				href={`data:text/json;charset=utf-8,${encodeURIComponent(
					schemaFileString
				)}`}
			/>
		</div>
	)
}

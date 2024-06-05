/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CardLink from 'components/card-link'
import {
	ProductIconHeading,
	Description,
	StandaloneLinkContents,
} from 'components/try-hcp-callout/components'
import { TryHcpCalloutCompactProps } from 'components/try-hcp-callout/types'
import s from './try-hcp-callout-compact.module.css'

/**
 * Renders a compact HCP themed callout card, without a mock UI visual.
 * Intended for use with "Try HCP" callouts.
 */
export function TryHcpCalloutCompact({
	productSlug,
	heading,
	description,
	ctaText,
	ctaUrl,
}: TryHcpCalloutCompactProps) {
	return (
		<CardLink className={s.root} ariaLabel={ctaText} href={ctaUrl}>
			<div className={s.background} />
			<ProductIconHeading
				productSlug={productSlug}
				headingText={heading}
				size="small"
			/>
			<Description description={description} />
			<StandaloneLinkContents text={ctaText} size="small" />
		</CardLink>
	)
}

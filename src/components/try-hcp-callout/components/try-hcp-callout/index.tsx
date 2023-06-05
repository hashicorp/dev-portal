/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import CardLink from 'components/card-link'
import {
	Description,
	ProductIconHeading,
	StandaloneLinkContents,
} from 'components/try-hcp-callout/components'
import { TryHcpCalloutProps } from 'components/try-hcp-callout/types'
import { HcpLogoHeading } from '../hcp-logo-heading'
import s from './try-hcp-callout.module.css'

/**
 * Renders an HCP themed callout card,
 * with a mock UI visual on large viewports.
 * Intended for use with "Try HCP" callouts.
 */
export function TryHcpCallout({
	productSlug,
	heading,
	description,
	ctaText,
	ctaUrl,
}: TryHcpCalloutProps) {
	return (
		<CardLink className={s.root} ariaLabel={ctaText} href={ctaUrl}>
			<div className={s.background} />
			<div className={s.textContainer}>
				{productSlug === 'hcp' ? (
					<HcpLogoHeading headingText={heading} />
				) : (
					<ProductIconHeading productSlug={productSlug} headingText={heading} />
				)}
				<Description description={description} />
				<StandaloneLinkContents text={ctaText} />
			</div>
			<div className={s.imageContainer}>
				<div className={s.imageWrapper}>
					<div className={classNames(s.image, s[productSlug])} />
				</div>
			</div>
		</CardLink>
	)
}

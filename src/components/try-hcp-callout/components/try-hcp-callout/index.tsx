/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CardLink from 'components/card-link'
import {
	Description,
	ProductIconHeading,
	StandaloneLinkContents,
} from 'components/try-hcp-callout/components'
import { TryHcpCalloutProps } from 'components/try-hcp-callout/types'
import { HcpLogoHeading } from '../hcp-logo-heading'
import s from './try-hcp-callout.module.css'
import InlineSvg from '@hashicorp/react-inline-svg'
import boundarySvg from './img/try-hcp-callout-ui-mock-boundary.svg?include'
import consulSvg from './img/try-hcp-callout-ui-mock-consul.svg?include'
import packerSvg from './img/try-hcp-callout-ui-mock-packer.svg?include'
import terraformSvg from './img/try-hcp-callout-ui-mock-terraform.svg?include'
import vagrantSvg from './img/try-hcp-callout-ui-mock-vagrant.svg?include'
import vaultSvg from './img/try-hcp-callout-ui-mock-vault.svg?include'
import waypointSvg from './img/try-hcp-callout-ui-mock-waypoint.svg?include'

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
	const PRODUCT_SVG_MAP = new Map([
		['terraform', terraformSvg],
		['packer', packerSvg],
		['vault', vaultSvg],
		['boundary', boundarySvg],
		['consul', consulSvg],
		['waypoint', waypointSvg],
		['vagrant', vagrantSvg],
	])
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
					<InlineSvg
						src={PRODUCT_SVG_MAP.get(productSlug) ?? vaultSvg}
						className={s.image}
					/>
				</div>
			</div>
		</CardLink>
	)
}

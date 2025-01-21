/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties } from 'react'
import { HeroHeadingVisualProps } from './types'
import s from './hero-heading-visual.module.css'

/**
 * Only some of the values for `ProductSlug` have branded color tokens.
 * Ref: https://helios.hashicorp.design/foundations/colors
 */
const PRODUCTS_WITH_COLOR_TOKENS = [
	'boundary',
	'consul',
	'nomad',
	'packer',
	'terraform',
	'vagrant',
	'vault',
	'waypoint',
]

/**
 * Given a product slug,
 * Return a `{ start, stop }` object representing color tokens for a gradient.
 */
function getProductGradient(
	productSlug: HeroHeadingVisualProps['productSlug']
): { start: string; stop: string } {
	// If the given product slug has brand color tokens, use them
	if (PRODUCTS_WITH_COLOR_TOKENS.includes(productSlug)) {
		return {
			start: `var(--token-color-${productSlug}-gradient-faint-start)`,
			stop: `var(--token-color-${productSlug}-gradient-faint-stop)`,
		}
	}
	// For Sentinel, use a blue gradient, as specified in designs
	if (productSlug === 'sentinel') {
		return {
			start: `var(--token-color-palette-blue-50)`,
			stop: `var(--token-color-palette-blue-100)`,
		}
	}
	// As a base case, return a default gradient
	return {
		start: `var(--token-color-palette-neutral-100)`,
		stop: `var(--token-color-palette-neutral-50)`,
	}
}

function HeroHeadingVisual({
	heading,
	image,
	productSlug,
}: HeroHeadingVisualProps) {
	const productGradient = getProductGradient(productSlug)

	return (
		<div
			className={s.root}
			style={
				{
					'--gradient-start': productGradient.start,
					'--gradient-stop': productGradient.stop,
				} as CSSProperties
			}
		>
			<h1 className={s.heading}>{heading}</h1>
			{image && (
				<div className={s.image}>
					<img src={image} alt="" />
				</div>
			)}
		</div>
	)
}

export { HeroHeadingVisual }
export default HeroHeadingVisual

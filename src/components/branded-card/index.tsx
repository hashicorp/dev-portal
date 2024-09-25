/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties } from 'react'
import Image, { type StaticImageData } from 'next/legacy/image'
import { BrandedCardProps } from './types'
import { ProductSlug } from 'types/products'
// Note: images are static imports, seems to be a requirement of next/image
// ref: https://nextjs.org/docs/basic-features/image-optimization#local-images
import patternBoundary from './img/boundary.png'
import patternConsul from './img/consul.png'
import patternNomad from './img/nomad.png'
import patternGeneric from './img/generic.png'
import patternPacker from './img/packer.png'
import patternTerraform from './img/terraform.png'
import patternVagrant from './img/vagrant.png'
import patternVault from './img/vault.png'
import patternWaypoint from './img/waypoint.png'
import s from './branded-card.module.css'

const PATTERN_IMG_MAP: Record<
	Exclude<ProductSlug, 'well-architected-framework'>,
	StaticImageData
> = {
	boundary: patternBoundary,
	consul: patternConsul,
	nomad: patternNomad,
	packer: patternPacker,
	terraform: patternTerraform,
	vagrant: patternVagrant,
	vault: patternVault,
	waypoint: patternWaypoint,
	hcp: patternGeneric,
	sentinel: patternGeneric,
}

/**
 * Render a card with a branded background, in a light theme.
 *
 * Note: Card padding can may depending on context and viewport width, so
 * this component does not set card padding around the provided `children`.
 * Consumers of this component should build the appropriate
 * padding into `children` as needed.
 *
 * Note: foreground elements within the card, such as text, should be dark
 * enough to product sufficient contrast against the brand background gradient.
 */
function BrandedCard({ productSlug, children }: BrandedCardProps) {
	const gradientDefault = {
		'--gradient-start': `var(--token-color-palette-neutral-100)`,
		'--gradient-stop': `var(--token-color-palette-neutral-50)`,
	}
	// when no product is passed, fall back to generic (hcp) default
	const gradient = productSlug
		? {
				'--gradient-start': `var(--token-color-${productSlug}-gradient-faint-start)`,
				'--gradient-stop': `var(--token-color-${productSlug}-gradient-faint-stop)`,
		  }
		: gradientDefault

	return (
		<div className={s.root} style={gradient as CSSProperties}>
			{/* Note: <div /> here is needed for flex layout to work as expected */}
			<div>{children}</div>
			<div className={s.productPattern}>
				<Image
					src={PATTERN_IMG_MAP[productSlug] || patternGeneric}
					/** Note: pattern image is purely decorative */
					alt=""
					layout="fill"
					objectFit="cover"
					objectPosition="center"
				/>
			</div>
		</div>
	)
}

export type { BrandedCardProps }
export default BrandedCard

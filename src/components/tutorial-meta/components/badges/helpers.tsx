/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { EditionOption, ProductUsed } from 'lib/learn-client/types'
import { Badge, type BadgeProps } from '@hashicorp/mds-react/components'
import { PRODUCT_SLUGS_TO_ICON_NAMES } from 'constants/product-slugs-to-icon-names'
import s from './badges.module.css'

const editionDisplayOptions: { [K in EditionOption]: string } = {
	[EditionOption.openSource]: 'Open Source',
	[EditionOption.enterprise]: 'Enterprise',
	[EditionOption.hcp]: 'HCP',
	[EditionOption.tfcFree]: 'HCP Terraform',
	[EditionOption.tfcEssentials]: 'Essentials',
	[EditionOption.tfcStandard]: 'Standard',
	[EditionOption.tfcPlus]: 'Plus',
	[EditionOption.tfcPremium]: 'Premium',
}

/**
 * Calculates whether a tutorial is 'beta' based on productsUsed data.
 */
export function getIsBeta(productsUsed: ProductUsed[]): boolean {
	return productsUsed.some(({ isBeta }: ProductUsed) => isBeta)
}

function TutorialMetaBadge(
	{text, ...rest}: Omit<BadgeProps, 'type' | 'className' | 'size'>
) {
	return <Badge text={text} className={s.badge} size="small" {...rest} />
}

/**
 * Builds the array of <Badge /> components to render.
 */
export const generateBadges = ({
	edition,
	hasVideo,
	isBeta,
	isInteractive,
	products,
}) => {
	const badges = []

	if (isBeta) {
		badges.push(<TutorialMetaBadge color="highlight" text="Beta" />)
	}

	// Edu team wants to hide the open source badge
	const showEditionBadge = edition !== 'open_source'
	if (showEditionBadge) {
		badges.push(<TutorialMetaBadge text={editionDisplayOptions[edition]} />)
	}

	const showProductBadges = Array.isArray(products) && products.length > 0
	if (showProductBadges) {
		products.forEach((product) => {
			badges.push(
				<TutorialMetaBadge
					key={product.slug}
					icon={PRODUCT_SLUGS_TO_ICON_NAMES[product.slug]}
					text={product.name}
				/>
			)
		})
	}

	if (hasVideo) {
		badges.push(<TutorialMetaBadge icon='play' text="Video" />)
	}

	if (isInteractive) {
		badges.push(
			<TutorialMetaBadge icon='terminal-screen' text="Interactive" />
		)
	}

	return badges
}

/**
 * Creates a readable string for presentation only based on the number of
 * minutes provided.
 *
 * For example: 831 => 13hr 51min
 */
export default function getReadableTime(minutes: number): string {
	const hours = Math.floor(minutes / 60)
	const min = minutes % 60
	if (hours && min > 0) {
		return `${hours}hr ${min}min`
	}
	if (hours) {
		return `${hours}hr`
	}
	return `${minutes}min`
}

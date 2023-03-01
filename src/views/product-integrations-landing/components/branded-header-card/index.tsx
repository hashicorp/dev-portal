/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BrandedCard from 'components/branded-card'
import { BrandedHeaderCardProps } from './types'
import s from './branded-header-card.module.css'

export function BrandedHeaderCard({
	heading,
	description,
	productSlug,
}: BrandedHeaderCardProps) {
	return (
		<BrandedCard productSlug={productSlug}>
			<div className={s.cardPadding}>
				<h1 className={s.heading}>{heading}</h1>
				{description ? <p className={s.description}>{description}</p> : null}
			</div>
		</BrandedCard>
	)
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'
import s from './product-icon-heading.module.css'

export interface ProductIconHeadingProps {
	productSlug: Exclude<ProductSlug, 'sentinel' | 'hcp'>
	headingText: string
	size?: 'small' | 'medium'
}

/**
 * A card heading component, for use in HCP callout cards.
 */
export function ProductIconHeading({
	productSlug,
	headingText,
	size = 'medium',
}: ProductIconHeadingProps) {
	return (
		<div className={s.root}>
			<ProductIcon
				productSlug={productSlug}
				className={classNames(s.icon, s[size])}
			/>
			<span className={classNames(s.heading, s[size])}>{headingText}</span>
		</div>
	)
}

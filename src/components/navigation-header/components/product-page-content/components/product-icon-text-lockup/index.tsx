/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import ProductIcon from 'components/product-icon'
import Image from 'next/image'
import { isProductSlug } from 'lib/products'
import s from './product-icon-text-lockup.module.css'
import { getProductLogo } from '../../utils'
import { useTheme } from 'next-themes'
import classNames from 'classnames'

export interface ProductIconTextLockupProps {
	slug: string
	name: string
}

/**
 * Render a logo-like lockup of a product icon, plus the product name.
 */
export function ProductIconTextLockup({
	name,
	slug,
}: ProductIconTextLockupProps) {
	const { theme, systemTheme } = useTheme()
	const imageTheme = theme === 'system' ? systemTheme : theme
	const productLogo = getProductLogo(slug, imageTheme)
	const iaPosthogVariant = true // TODO: Replace with actual PostHog experiment variant check when available

	const logoImage = () => {
		return <Image src={productLogo} alt={`${name} Logo`} unoptimized />
	}

	const titleWithoutLogoImage = () => {
		return (
			<>
				{/* Note: we don't render an icon for HCP, even if we have one */}
				{isProductSlug(slug) && slug !== 'hcp' ? (
					<ProductIcon productSlug={slug} className={s.icon} />
				) : null}
				<span className={classNames(s.text, {[s.iaExperimentText]: iaPosthogVariant})}>{name}</span>
			</>
		)
	}
	return (
		<div className={s.root}>
			{iaPosthogVariant && productLogo ? logoImage() : titleWithoutLogoImage()}
		</div>
	)
}

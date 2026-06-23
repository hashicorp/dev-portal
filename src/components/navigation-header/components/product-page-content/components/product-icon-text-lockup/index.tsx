/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import ProductIcon from 'components/product-icon'
import InlineSvg from '@hashicorp/react-inline-svg'
import { isProductSlug } from 'lib/products'
import s from './product-icon-text-lockup.module.css'
import { getProductLogo } from '../../utils'

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
	const lightLogo = getProductLogo(slug, 'light')
	const darkLogo = getProductLogo(slug, 'dark')
	const hasLogo = lightLogo && darkLogo

	const logoImage = () => {
		// Render both theme variants and toggle them with CSS via the
		// `data-hide-on-theme` attribute (see styles/themes/global.css). The
		// active variant is determined by the `data-theme` attribute on <html>,
		// which is set before paint, so the correct logo shows immediately.
		// The logos are inlined as SVG markup (rather than an <img> src) so they
		// are part of the React tree and aren't re-fetched or re-decoded on
		// client-side navigation, which avoids flickering on navigation.
		return (
			<>
				<InlineSvg
					className={s.logo}
					data-hide-on-theme="dark"
					aria-label={`${name} Logo`}
					src={lightLogo}
				/>
				<InlineSvg
					className={s.logo}
					data-hide-on-theme="light"
					aria-label={`${name} Logo`}
					src={darkLogo}
				/>
			</>
		)
	}

	const titleWithoutLogoImage = () => {
		return (
			<>
				{/* Note: we don't render an icon for HCP, even if we have one */}
				{isProductSlug(slug) && slug !== 'hcp' ? (
					<ProductIcon productSlug={slug} className={s.icon} />
				) : null}
				<span className={s.text}>{name}</span>
			</>
		)
	}
	return (
		<div className={s.root}>
			{hasLogo ? logoImage() : titleWithoutLogoImage()}
		</div>
	)
}

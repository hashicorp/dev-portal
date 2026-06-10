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
import { useEffect, useState } from 'react'

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
	const [mounted, setMounted] = useState(false)
	const { theme, systemTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])
	// Before mount, default to the light theme so the server and first client
	// render match. Resolving a logo on every render (rather than waiting for
	// mount) keeps the rendered element stable and avoids the flicker caused by
	// swapping between the fallback icon and the logo image on navigation.
	const imageTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'
	const productLogo = getProductLogo(slug, imageTheme)

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
				<span className={s.text}>{name}</span>
			</>
		)
	}
	return (
		<div className={s.root}>
			{productLogo ? logoImage() : titleWithoutLogoImage()}
		</div>
	)
}

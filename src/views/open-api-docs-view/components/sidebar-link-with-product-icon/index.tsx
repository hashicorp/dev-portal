/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { SidebarLink } from '../sidebar-link'
// Utils
import { isProductSlug } from 'lib/products'
// Types
import type { ProductSlug } from 'types/products'
// Styles
import s from './style.module.css'

/**
 * Render a fancy-looking, product themed linked sidebar item.
 *
 * Intended to be used as a kind of title-ish element, to establish hierarchy
 * within sidebar contents.
 *
 * This component is largely the same as SidebarNavHighlightItem, but
 * requires `href`, and eliminates some related conditional rendering.
 * See notes in `../sidebar-link` for more thoughts on a potential move
 * away from previously implemented sidebar link components.
 */
export function SidebarLinkWithProductIcon({
	productSlug,
	text,
	href,
	isActive,
}: {
	productSlug: ProductSlug
	text: string
	href: string
	isActive: boolean
}) {
	const icon = isProductSlug(productSlug) ? (
		<ProductIcon className={s.icon} productSlug={productSlug} />
	) : null

	return (
		<SidebarLink
			aria-current={isActive ? 'page' : undefined}
			className={s.root}
			href={href}
		>
			{icon}
			<Text asElement="span" size={200} weight="medium">
				{text}
			</Text>
		</SidebarLink>
	)
}

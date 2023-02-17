/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'components/link'
import classNames from 'classnames'
import { isProductSlug } from 'lib/products'
import ProductIcon from 'components/product-icon'
import { NavHighlightItem } from 'components/sidebar/types'
import s from './sidebar-nav-highlight-item.module.css'

/**
 * Render a fancy-looking, product themed linked sidebar item.
 *
 * Intended to be used as a kind of title-ish element, to establish hierarchy
 * within sidebar contents.
 */
export default function SidebarNavHighlightItem({
	theme,
	text,
	href,
	isActive,
}: {
	theme: NavHighlightItem['theme']
	text: string
	href: string
	isActive?: boolean
}) {
	return (
		<Link
			aria-current={isActive ? 'page' : undefined}
			className={classNames(s.root, s[`theme-${theme}`])}
			href={href}
		>
			{isProductSlug(theme) ? <ProductIcon productSlug={theme} /> : null}
			<span className={s.text}>{text}</span>
		</Link>
	)
}

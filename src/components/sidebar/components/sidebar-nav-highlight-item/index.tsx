/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'components/link'
import classNames from 'classnames'
import { isProductSlug } from 'lib/products'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { NavHighlightItem } from 'components/sidebar/types'
import s from './sidebar-nav-highlight-item.module.css'
import { log } from 'console'

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
	href?: string
	isActive?: boolean
}) {
	const icon = isProductSlug(theme) ? (
		<ProductIcon className={s.icon} productSlug={theme} />
	) : null
	const textEl = <span className={s.text}>{text}</span>

	if (!href?.length) {
		return (
			<Text
				asElement="p"
				aria-current={isActive ? 'page' : undefined}
				className={classNames(s.root, s[`theme-${theme}`])}
			>
				{icon}
				{textEl}
			</Text>
		)
	}
	return (
		<Link
			aria-current={isActive ? 'page' : undefined}
			className={classNames(s.root, s[`theme-${theme}`])}
			href={href}
		>
			{icon}
			{textEl}
		</Link>
	)
}

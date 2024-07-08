/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	SidebarSectionHeadingProps,
	SidebarTitleHeadingProps,
	SidebarSectionBrandedHeadingProps,
} from './types'
import s from './sidebar-headings.module.css'
import { isProductSlug } from 'lib/products'
import ProductIcon from 'components/product-icon'
import classNames from 'classnames'

/**
 * Should be used for rendering the title of an entire Sidebar. There should
 * only be one rendered for a single Sidebar.
 *
 * An <h2> is rendered to set up the outline hierarchy of the Sidebar navigation
 * elements. If there are sections of elements, they should each be labelled
 * using a `SidebarSectionHeading`.
 *
 * It is OK that there is no <h1> in the Sidebar before this, and it is also OK
 * that the <h1> for a page appears after the Sidebar. What's important is that
 * we are not rendering more than one <h1> on a single page.
 *
 * See example 2 here: https://www.w3.org/WAI/tutorials/page-structure/headings/
 */
const SidebarTitleHeading = ({ id, text }: SidebarTitleHeadingProps) => {
	return (
		<h2 className={s.root} id={id}>
			{text}
		</h2>
	)
}

/**
 * Used for labeling a section of Sidebar menu items. In the markup, this should
 * appear directly before the <ul> element that wraps the group of menu items.
 *
 * Use `SidebarTitleHeading` if you're looking to add a single title for an
 * entire Sidebar.
 */
const SidebarSectionHeading = ({ text }: SidebarSectionHeadingProps) => {
	return <h3 className={s.root}>{text}</h3>
}

const SidebarSectionBrandedHeading = ({
	text,
	theme,
}: SidebarSectionBrandedHeadingProps) => {
	return (
		<h3 className={classNames(s.brandedRoot, s[`theme-${theme}`])}>
			{isProductSlug(theme) ? (
				<ProductIcon className={s.icon} productSlug={theme} />
			) : null}
			<span className={s.text}>{text}</span>
		</h3>
	)
}

export {
	SidebarSectionHeading,
	SidebarTitleHeading,
	SidebarSectionBrandedHeading,
}

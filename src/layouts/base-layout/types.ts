/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PropsWithChildren, ReactNode } from 'react'
import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'

interface BaseLayoutProps extends PropsWithChildren {
	/**
	 * Defaults to false. If true, a border will be shown to separate
	 * the footer from the page contents above.
	 */
	showFooterTopBorder?: boolean

	/**
	 * A slot in which to render a `MobileMenuContainer`.
	 *
	 * Note: we always render `MobileMenuButton` through the `NavigationHeader`
	 * component. However, some layouts, such as `SidebarSidecar` layout,
	 * do not use `mobileMenuSlot` and instead render a `MobileMenuContainer`
	 * elsewhere. The original intent was to have the sidebar and mobile menu
	 * pane be the exact same DOM elements across all viewports.
	 *
	 * We may be able to simplify this implementation and remove the need
	 * for `mobile-menu-context` for open-and-close state by locating the
	 * rendering of the mobile menu "pane" alongside the mobile menu "button".
	 * With this approach, we'd pass `mobileMenuSlot` to the `NavigationHeader`,
	 * and the `NavigationHeader` would render the `MobileMenuButton` and
	 * `MobileMenuContainer` together. This would allow us to remove the
	 * `mobile-menu-context`, as the `MobileMenuButton` "trigger" and
	 * `MobileMenuContainer` "pane" would no longer be located in disparate
	 * parts of the render tree.
	 *
	 * With the above refactor in mind, and if we're okay with having
	 * `SidebarSidecar` render the sidebar and mobile menu as separate DOM
	 * elements, we could make this prop required, and remove the possibility
	 * of the `MobileMenuButton` potentially having no `MobileMenuContainer`
	 * to open and close.
	 *
	 * Discussion Task:
	 * https://app.asana.com/0/1202097197789424/1205087147421651/f
	 */
	mobileMenuSlot?: ReactNode
}

interface AlertBannerProps {
	tag: string
	url: string
	text: string
	linkText: string
	product?: HashiCorpProduct
	expirationDate?: string
}

export type { BaseLayoutProps, AlertBannerProps }

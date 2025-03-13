/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import classNames from 'classnames'
import { Fragment } from 'react'
// Components
import {
	SidebarHorizontalRule,
	SidebarSectionHeading,
} from '@components/sidebar/components'
import { SidebarLink, SidebarLinkText } from '../sidebar-link'
import { SidebarLinkWithProductIcon } from '../sidebar-link-with-product-icon'
// Types
import type { ProductSlug } from 'types/products'
// Styles
import s from './style.module.css'

/**
 * Renders sidebar contents for the OpenAPI V2 docs view.
 */
export function OpenApiV2SidebarContents({
	landingLink,
	operationLinkGroups,
}: {
	landingLink: {
		text: string
		href: string
		isActive: boolean
		theme: ProductSlug
	}
	operationLinkGroups: {
		text: string
		items: { text: string; href: string; isActive: boolean }[]
	}[]
}) {
	return (
		<ul className={s.listResetStyles}>
			{/* Fancy icon link, meant for landing view */}
			<SidebarLinkWithProductIcon
				href={landingLink.href}
				isActive={landingLink.isActive}
				text={landingLink.text}
				productSlug={landingLink.theme}
			/>
			{/* Operation links, in groups */}
			{operationLinkGroups.map((group) => {
				return (
					<Fragment key={group.text}>
						<SidebarHorizontalRule />
						<ul className={s.listResetStyles}>
							<SidebarSectionHeading text={group.text} />
							<li>
								<ul
									className={classNames(s.listResetStyles, s.sidebarLinkList)}
								>
									{group.items.map((item, index) => {
										const { href, text, isActive } = item
										const key = `${href}-${index}`
										return (
											<SidebarLink
												key={key}
												aria-current={isActive ? 'page' : undefined}
												href={href}
											>
												<SidebarLinkText>{text}</SidebarLinkText>
											</SidebarLink>
										)
									})}
								</ul>
							</li>
						</ul>
					</Fragment>
				)
			})}
		</ul>
	)
}

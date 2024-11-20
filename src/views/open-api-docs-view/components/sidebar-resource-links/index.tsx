/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import classNames from 'classnames'
// Components
import { SidebarSectionHeading } from '@components/sidebar/components'
import { SidebarLink, SidebarLinkText } from '../sidebar-link'
import { SidebarLinkExternal } from '../sidebar-link-external'
// Styles
import s from './style.module.css'

/**
 * Render a list of sidebar links, each of which may or may not be external.
 */
export function SidebarResourceLinks({
	resourceLinks,
}: {
	resourceLinks: { text: string; href: string; isExternal: boolean }[]
}) {
	return (
		<ul className={s.listResetStyles}>
			<SidebarSectionHeading text="Resources" />
			<li>
				<ul className={classNames(s.listResetStyles, s.sidebarLinkList)}>
					{resourceLinks.map((item, index) => {
						const { href, text, isExternal } = item
						const key = `${href}-${index}`
						if (isExternal) {
							return (
								<SidebarLinkExternal key={key} href={href}>
									{text}
								</SidebarLinkExternal>
							)
						} else {
							return (
								<SidebarLink key={key} href={href}>
									<SidebarLinkText>{text}</SidebarLinkText>
								</SidebarLink>
							)
						}
					})}
				</ul>
			</li>
		</ul>
	)
}

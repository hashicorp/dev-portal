/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { SidebarLink, SidebarLinkText } from '../sidebar-link'
// Types
import type { PropsWithChildren } from 'react'
// Styles
import s from './style.module.css'

/**
 * Render a SidebarLink with an external link icon.
 */
export function SidebarLinkExternal({
	href,
	children,
}: PropsWithChildren<{
	href: string
}>) {
	return (
		<SidebarLink
			className={s.root}
			href={href}
			/**
			 * We've decided to open external links in new tabs, note there's
			 * underlying logic in @components/link that handles target="_blank"
			 */
			target="_blank"
			/**
			 * Modern browsers treat target="_blank" as implicitly
			 * having noopener, but we include it explicitly anyways.
			 * Note that in past implementations of similar components, we added
			 * rel=noreferrer as well. This doesn't seem necessary in a sidebar
			 * context, where we control which links appear, and will likely benefit
			 * from knowing when users are referred from our docs to pages elsewhere
			 * within our web presence.
			 */
			rel="noopener"
		>
			<SidebarLinkText>{children}</SidebarLinkText>
			<span className={s.icon}>
				<IconExternalLink16 />
			</span>
		</SidebarLink>
	)
}

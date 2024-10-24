/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Link from '@components/link'
import Text from '@components/text'
// Types
import type { PropsWithChildren } from 'react'
import type { LinkProps } from '@components/link'
// Styles
import s from './style.module.css'
import classNames from 'classnames'

/**
 * Render a link element styled for use in our sidebar.
 *
 * Note: this component is based on the existing SidebarNavLinkItem. This
 * component aims to render similar link elements through a more composable
 * interface. We could in theory start to replace SidebarNavLinkItem with
 * this component. For now, focus is on delivering API docs, so intent here
 * is more narrow, hopefully this component will make the new API docs easier
 * to maintain and iterate on by decoupling from our existing component. If
 * we're happy with the pattern, then we could adopt it elsewhere.
 *
 * If further functionality from SidebarNavLinkItem is required in this
 * context, it may be worth first trying to build the desired use case by
 * composing existing pieces (such as SidebarLink and SidebarLinkText).
 * For example, an "external link" component could be something like
 * `<SidebarLink><SidebarLinkText /><IconExternalLink16 /></SidebarLink>`.
 *
 * If composed patterns are repeated _exactly_, and in a way where we'd
 * definitely want to update all instances at once, then it may be worth
 * creating a re-usable component that captures the composition pattern.
 *
 * A component that captures a common pattern of composition should _not_ need
 * any conditional statements. The props interface should be very simple - the
 * point being to _reduce_ the complexity of repeated the identical composed
 * pattern. If "edge cases" need to be handled, then the consumer can "eject"
 * from the composed pattern by copying and pasting the body of the composed
 * component and making changes from there.
 */
export function SidebarLink({
	children,
	/**
	 * We merge the className prop with our own styles. This allows consumers
	 * to target the `<a />` element rendered by `<Link />`.
	 */
	className,
	...linkProps
}: PropsWithChildren<LinkProps>) {
	return (
		<Link {...linkProps} className={classNames(s.sidebarLink, className)}>
			{children}
		</Link>
	)
}

/**
 * Render a span element with text styles that fit with SidebarLink.
 */
export function SidebarLinkText({ children }) {
	return (
		<Text asElement="span" size={200} weight="regular">
			{children}
		</Text>
	)
}

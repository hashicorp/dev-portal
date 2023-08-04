/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	KeyboardEventHandler,
	ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { ProductSlug } from 'types/products'
import isAbsoluteUrl from 'lib/is-absolute-url'
import Badge from 'components/badge'
import Link from 'components/link'
import { MenuItem, MenuItemOptionalProperties } from 'components/sidebar'
import ProductIcon from 'components/product-icon'
import {
	SidebarHorizontalRule,
	SidebarNavHighlightItem,
	SidebarSectionHeading,
} from 'components/sidebar/components'
import Text from 'components/text'
import {
	RightIconsContainerProps,
	SidebarNavLinkItemProps,
	SidebarNavMenuButtonProps,
	SidebarNavMenuItemBadgeProps,
	SupportedIconName,
} from './types'
import s from './sidebar-nav-menu-item.module.css'

/**
 * Used for leading icon in `SidebarNavLinkItem`.
 */
const SUPPORTED_LEADING_ICONS: {
	[key in SupportedIconName]: ReactElement
} = {
	home: <IconHome16 name="home" />,
	guide: <IconGuide16 />,
}

/**
 * Handles rendering the content of the right-side of a `SidebarNavMenuItem`.
 * This content may include one `Badge`, one `Icon`, one of each, or neither.
 * Returns `null` if neither are provided.
 */
const RightIconsContainer = ({ badge, icon }: RightIconsContainerProps) => {
	if (!badge && !icon) {
		return null
	}

	return (
		<div className={s.rightIconsContainer}>
			{badge}
			{icon}
		</div>
	)
}

/**
 * A wrapper around Badge for rendering consistent Badges in SidebarNavMenuItem.
 */
const SidebarNavMenuItemBadge = ({
	color,
	text,
	type,
}: SidebarNavMenuItemBadgeProps) => {
	if (color !== 'highlight' && color !== 'neutral') {
		throw new Error(
			`[SidebarNavMenuItemBadge] Only the "highlight" and "neutral" colors are supported for Badges, but was given ${color}.`
		)
	}

	return <Badge color={color} size="small" text={text} type={type} />
}

/**
 * Handles rendering a link menu item in the Sidebar. Will automatically
 * determine whether or not the link is external to DevDot, and will render an
 * external link icon if the link is external.
 */
const SidebarNavLinkItem = ({ item }: SidebarNavLinkItemProps) => {
	const href = item.fullPath || item.href
	const isExternal = isAbsoluteUrl(href)
	const hasBadge = !!(item as $TSFixMe).badge

	// Determine the leading icon to use, if any
	let leadingIcon
	if (item.leadingIconName) {
		const icon = SUPPORTED_LEADING_ICONS[item.leadingIconName] || (
			<ProductIcon productSlug={item.leadingIconName as ProductSlug} />
		)
		leadingIcon = <div className={s.leadingIcon}>{icon}</div>
	}

	// Determine the trailing icon to use, if any
	const trailingIcon = isExternal ? <IconExternalLink16 /> : item.trailingIcon
	const ariaCurrent = !isExternal && item.isActive ? 'page' : undefined
	const [isMounted, setIsMounted] = useState(false)

	/**
	 * Note on this useEffect:
	 *
	 * Due to how we are rewriting routes for tutorial variants, the URLs rendered in
	 * this component are incorrect during SSR, and for some reason are NOT
	 * getting reconciled on the client even though all of the props and state
	 * values internal to Link are correct. So the ariaCurrent value wasn't being
	 * set properly and the active item wouldn't render. We think its due to a hydration
	 * mismatch error. This set state ensures that after the component mounts, it gets resolved
	 * by forcing a rerender.
	 */
	useEffect(() => {
		setIsMounted(true)
	}, [])

	const ariaLabel = isExternal
		? `${item.title}. Opens in a new tab.`
		: undefined
	const className = s.sidebarNavMenuItem
	const rel = isExternal ? 'noreferrer noopener' : undefined

	const anchorContent = (
		<>
			{leadingIcon}
			<Text
				asElement="span"
				className={s.navMenuItemLabel}
				dangerouslySetInnerHTML={{ __html: item.title }}
				size={200}
				weight="regular"
			/>
			<RightIconsContainer
				badge={
					hasBadge ? (
						<SidebarNavMenuItemBadge {...(item as $TSFixMe).badge} />
					) : undefined
				}
				icon={trailingIcon}
			/>
		</>
	)

	if (href) {
		// link is not "disabled"
		return (
			<Link
				key={String(isMounted)}
				aria-current={ariaCurrent}
				aria-label={ariaLabel}
				className={className}
				data-heap-track="sidebar-nav-link-item"
				href={href}
				opensInNewTab={isExternal}
				rel={rel}
			>
				{anchorContent}
			</Link>
		)
	} else {
		// link is "disabled"
		return (
			<a
				aria-disabled
				aria-label={(item as $TSFixMe).ariaLabel}
				className={className}
				tabIndex={0}
			>
				{anchorContent}
			</a>
		)
	}
}

/**
 * Handles rendering a button and icon for the sidebar.
 * Currently used for a 'sign out' action on the profile page
 */
export function SidebarNavMenuButton({ item }: SidebarNavMenuButtonProps) {
	return (
		<button className={s.sidebarNavMenuItem} onClick={item.onClick}>
			<Text
				size={200}
				weight="regular"
				asElement="span"
				className={s.navMenuItemLabel}
			>
				{item.title}
			</Text>
			<RightIconsContainer icon={item.icon} />
		</button>
	)
}

/**
 * Given a MenuItem,
 * Return `true` if the item should be shown "open" by default,
 * or `false` otherwise.
 *
 * TODO: update input `item` type to be the "submenu" item type specifically.
 */
function getDefaultOpen(item: MenuItemOptionalProperties): boolean {
	const defaultOpenProps = [
		'isOpen',
		'hasActiveChild',
		'hasChildrenMatchingFilter',
		'matchesFilter',
	]
	const isDefaultOpen = defaultOpenProps.reduce((acc, prop) => {
		if (item[prop]) {
			return true
		}
		return acc
	}, false)
	return isDefaultOpen
}

/**
 * Handles rendering a collapsible/expandable submenu item and its child menu
 * items in the Sidebar.
 */
const SidebarNavSubmenuItem = ({
	item,
}: {
	// TODO: update this `item` type to be the "submenu" item type specifically.
	item: MenuItemOptionalProperties
}) => {
	const buttonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(getDefaultOpen(item))
	const hasBadge = !!(item as $TSFixMe).badge

	/**
	 * Without this effect, the menu items aren't re-rerendered to be open. Seems
	 * to be because the item prop sent to the component don't change. Might work
	 * if we pass the props needed instead of just the item object?
	 */
	useEffect(() => {
		setIsOpen(getDefaultOpen(item))
	}, [item])

	const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			e.stopPropagation()
			setIsOpen(false)
			buttonRef.current.focus()
		}
	}

	const buttonId = `${item.id}-button`
	const listId = `${item.id}-list`
	return (
		<>
			<button
				aria-controls={listId}
				aria-expanded={isOpen}
				className={s.sidebarNavMenuItem}
				id={buttonId}
				onClick={() => setIsOpen((prevState: boolean) => !prevState)}
				ref={buttonRef}
				data-heap-track="sidebar-nav-submenu-button"
			>
				<Text
					asElement="span"
					className={s.navMenuItemLabel}
					dangerouslySetInnerHTML={{ __html: item.title }}
					size={200}
					weight="regular"
				/>
				<RightIconsContainer
					badge={
						hasBadge ? (
							<SidebarNavMenuItemBadge {...(item as $TSFixMe).badge} />
						) : undefined
					}
					icon={<IconChevronDown16 />}
				/>
			</button>
			{isOpen && (
				<ul id={listId} onKeyDown={handleKeyDown}>
					{item.routes.map((route: MenuItem, i) => {
						/**
						 * Note: these items _aren't_ stable since we filter them
						 * client-side... perhapse `useId` would be appropriate here?
						 * Or we could do that server-side before passing props to the
						 * client? `heading` and `divider` items do _not_ have a
						 * meaningful identifier; and some other items could potentially
						 * have duplicate identifiers. We need to better account for that.
						 */
						const uniqueIshId =
							'heading' in route
								? route.heading
								: route.id || route.fullPath || route.title
						const key = `${uniqueIshId}-${i}`
						return <SidebarNavMenuItem key={key} item={route} />
					})}
				</ul>
			)}
		</>
	)
}

/**
 * Handles conditionally rendering one of the following based on the properties
 * of the `item` passed in:
 *  - SidebarHorizontalRule
 *  - SidebarSectionHeading
 *  - SidebarNavSubmenu
 *  - SidebarNavLink
 */
const SidebarNavMenuItem = ({ item }: { item: MenuItem }) => {
	let itemContent
	if ('divider' in item) {
		itemContent = <SidebarHorizontalRule />
	} else if ('heading' in item) {
		itemContent = <SidebarSectionHeading text={item.heading} />
	} else if ('routes' in item) {
		itemContent = <SidebarNavSubmenuItem item={item} />
	} else if ('theme' in item) {
		itemContent = (
			<SidebarNavHighlightItem
				theme={item.theme}
				text={item.title}
				href={item.fullPath}
				isActive={item.isActive}
			/>
		)
	} else {
		itemContent = <SidebarNavLinkItem item={item} />
	}

	return <li>{itemContent}</li>
}

export { SidebarNavLinkItem, SidebarNavSubmenuItem }
export default SidebarNavMenuItem

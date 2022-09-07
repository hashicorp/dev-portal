import {
	KeyboardEventHandler,
	ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react'
import Link from 'next/link'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { ProductSlug } from 'types/products'
import isAbsoluteUrl from 'lib/is-absolute-url'
import Badge from 'components/badge'
import { MenuItem } from 'components/sidebar'
import ProductIcon from 'components/product-icon'
import {
	SidebarHorizontalRule,
	SidebarSectionHeading,
} from 'components/sidebar/components'
import Text from 'components/text'
import {
	RightIconsContainerProps,
	SidebarNavLinkItemProps,
	SidebarNavMenuButtonProps,
	SidebarNavMenuItemBadgeProps,
	SidebarNavMenuItemProps,
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

	// Conditionally determining props for the <a>
	const ariaCurrent = !isExternal && item.isActive ? 'page' : undefined
	const ariaLabel = isExternal
		? `${item.title}. Opens in a new tab.`
		: undefined
	const className = s.sidebarNavMenuItem
	const rel = isExternal ? 'noreferrer noopener' : undefined
	const target = isExternal ? '_blank' : undefined

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
			<Link href={href}>
				<a
					aria-current={ariaCurrent}
					aria-label={ariaLabel}
					className={className}
					rel={rel}
					target={target}
				>
					{anchorContent}
				</a>
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
 * Handles rendering a collapsible/expandable submenu item and its child menu
 * items in the Sidebar.
 */
const SidebarNavSubmenuItem = ({ item }: SidebarNavMenuItemProps) => {
	const buttonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(
		item.isOpen ||
			item.hasActiveChild ||
			item.hasChildrenMatchingFilter ||
			item.matchesFilter
	)
	const hasBadge = !!(item as $TSFixMe).badge

	/**
	 * Without this effect, the menu items aren't re-rerendered to be open. Seems
	 * to be because the item prop sent to the component don't change. Might work
	 * if we pass the props needed instead of just the item object?
	 */
	useEffect(() => {
		setIsOpen(
			item.isOpen ||
				item.hasActiveChild ||
				item.hasChildrenMatchingFilter ||
				item.matchesFilter
		)
	}, [
		item.isOpen,
		item.hasActiveChild,
		item.hasChildrenMatchingFilter,
		item.matchesFilter,
	])

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
					icon={<IconChevronRight16 />}
				/>
			</button>
			{isOpen && (
				<ul id={listId} onKeyDown={handleKeyDown}>
					{item.routes.map((route: MenuItem) => (
						<SidebarNavMenuItem key={route.id} item={route} />
					))}
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
const SidebarNavMenuItem = ({ item }: SidebarNavMenuItemProps) => {
	let itemContent
	if (item.divider) {
		itemContent = <SidebarHorizontalRule />
	} else if (item.heading) {
		itemContent = <SidebarSectionHeading text={item.heading} />
	} else if (item.routes) {
		itemContent = <SidebarNavSubmenuItem item={item} />
	} else {
		itemContent = <SidebarNavLinkItem item={item} />
	}

	return <li id={item.id}>{itemContent}</li>
}

export { SidebarNavLinkItem, SidebarNavSubmenuItem }
export default SidebarNavMenuItem

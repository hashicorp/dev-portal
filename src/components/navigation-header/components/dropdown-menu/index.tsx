// Third-party imports
import { Fragment, KeyboardEvent, ReactElement, useRef, useState } from 'react'
import Link from 'next/link'
import { useId } from '@react-aria/utils'
import classNames from 'classnames'

// HashiCorp imports
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'

// Global imports
import { SUPPORTED_ICONS } from 'content/supported-icons'
import { ProductSlug } from 'types/products'
import useCurrentPath from 'hooks/use-current-path'
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import deriveKeyEventState from 'lib/derive-key-event-state'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import {
	NavigationHeaderItem,
	NavigationHeaderDropdownMenuProps,
	NavigationHeaderItemGroup,
} from 'components/navigation-header/types'

// Local imports
import s from './dropdown-menu.module.css'

/**
 * A dropdown navigation menu consisiting of an activator button and a dropdown
 * containing groups of menu item links.
 *
 * @TODO leverage NavigationDisclosure component
 */
const NavigationHeaderDropdownMenu = ({
	ariaLabel,
	buttonClassName,
	dropdownClassName,
	iconClassName,
	itemGroups,
	label,
	leadingIcon,
}: NavigationHeaderDropdownMenuProps) => {
	const uniqueId = useId()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const menuRef = useRef<HTMLDivElement>()
	const activatorButtonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(false)
	const numberOfItemGroups = itemGroups.length
	const menuId = `navigation-header-menu-${uniqueId}`
	const hasLeadingIcon = !!leadingIcon

	// Handles closing the menu if there is a click outside of it and it is open.
	useOnClickOutside([menuRef], () => setIsOpen(false), isOpen)

	// Handles closing the menu if focus moves outside of it and it is open.
	useOnFocusOutside([menuRef], () => setIsOpen(false), isOpen)

	// Check for a visible icon or label
	if (!label && !hasLeadingIcon) {
		throw new Error(
			'`NavigationHeaderDropdownMenu` needs either the `label` or `leadingIcon` prop.'
		)
	}

	// if the disclosure is open, handle closing it on `routeChangeStart`
	useOnRouteChangeStart({
		handler: () => setIsOpen(false),
		shouldListen: isOpen,
	})

	// Check for an accesible label if there is a leading icon
	const accessibleLabel = ariaLabel || label
	if (leadingIcon && !accessibleLabel) {
		throw new Error(
			'`NavigationHeaderDropdownMenu` needs either the `ariaLabel` or `label` prop to have an accessible label.'
		)
	}

	/**
	 * Generates a unique ID for a single dropdown menu item based on the ID of
	 * the group it belongs to.
	 */
	const generateItemId = (groupId: string, itemIndex: number): string => {
		return `${groupId}-item-${itemIndex}`
	}

	/**
	 * Generates a unique ID for a group of items based on the main menu ID and
	 * the index of the group.
	 */
	const generateItemGroupId = (groupIndex: number): string => {
		return `${menuId}-itemGroup-${groupIndex}`
	}

	/**
	 * Handles click interaction with the activator button. When clicked, if the
	 * menu is:
	 *  - open, then it will be closed
	 *  - closed, then it will be opened
	 */
	const handleClick = () => {
		setIsOpen(!isOpen)
	}

	/**
	 * Handles the behavior that should happen when a key is pressed down.
	 * Currently used by both the activator button and each menu item anchor
	 * element. Currently only handles what happens when the Escape is pressed
	 * because all other keyboard interaction is handled by default interactions
	 * with these elements.
	 *
	 * On Escape:
	 *  - the menu is closed, if it is open
	 *  - the activator button is given focus
	 */
	const handleKeyDown = (e: KeyboardEvent) => {
		const { isEscapeKey } = deriveKeyEventState(e)
		if (isEscapeKey) {
			setIsOpen(false)
			activatorButtonRef.current.focus()
		}
	}

	/**
	 * Handles the start of a mouse hover interaction with the activator button.
	 * When the mouse pointer hovers over the activator button, the menu will be
	 * opened if it is not already open.
	 */
	const handleMouseEnter = () => {
		if (!isOpen) {
			setIsOpen(true)
		}
	}

	/**
	 * Handles the end of a mouse hover interaction with the entire menu. If the
	 * menu is open, and the mouse moves outside the bounds either the activator
	 * button or the dropdown menu list, then the menu will be closed.
	 */
	const handleMouseLeave = () => {
		if (isOpen) {
			setIsOpen(false)
		}
	}

	/**
	 * Handles rendering the leading icon and/or label text for the menu's
	 * activator button.
	 */
	const ActivatorButtonContent = () => {
		let icon: ReactElement
		if (hasLeadingIcon) {
			icon = <span className={s.activatorLeadingIcon}>{leadingIcon}</span>
		}

		let text: ReactElement
		if (label) {
			text = (
				<Text
					asElement="span"
					className={s.activatorText}
					size={200}
					weight="medium"
				>
					{label}
				</Text>
			)
		}

		return (
			<>
				{icon}
				{text}
			</>
		)
	}

	return (
		<div className={s.root} onMouseLeave={handleMouseLeave} ref={menuRef}>
			<div className={s.activatorWrapper}>
				<button
					aria-controls={menuId}
					aria-expanded={isOpen}
					aria-label={accessibleLabel}
					className={classNames(s.activator, buttonClassName)}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					onMouseEnter={handleMouseEnter}
					ref={activatorButtonRef}
				>
					<ActivatorButtonContent />
					<IconChevronDown16 className={s.activatorTrailingIcon} />
				</button>
			</div>
			<div
				className={classNames(s.dropdownContainer, dropdownClassName)}
				id={menuId}
				style={{ display: isOpen ? 'block' : 'none' }}
			>
				{itemGroups.map(
					(itemGroup: NavigationHeaderItemGroup, groupIndex: number) => {
						const { items, label } = itemGroup
						const groupId = generateItemGroupId(groupIndex)
						const isLastItemGroup = groupIndex === numberOfItemGroups - 1
						const showDivider = numberOfItemGroups > 1 && !isLastItemGroup
						const hasLabel = !!label
						const itemGroupLabelId = hasLabel
							? `${groupId}-itemGroupLabel`
							: undefined
						return (
							<Fragment key={groupId}>
								{hasLabel && (
									<Text
										asElement="p"
										className={s.itemGroupLabel}
										id={itemGroupLabelId}
										size={100}
										weight="semibold"
									>
										{label}
									</Text>
								)}
								<ul
									aria-labelledby={itemGroupLabelId}
									className={classNames(s.itemGroup, {
										[s.twoColumns]: items.length >= 10,
									})}
								>
									{items.map(
										(item: NavigationHeaderItem, itemIndex: number) => {
											const icon = SUPPORTED_ICONS[item.icon] || (
												<ProductIcon productSlug={item.icon as ProductSlug} />
											)
											const itemId = generateItemId(groupId, itemIndex)
											const linkHref = item.path
											const isCurrentPage = linkHref === currentPath
											const hasBadge = !!item.badge
											const anchorContent = (
												<div className={s.itemLinkContent}>
													<div className={s.leftAlignedItemLinkContent}>
														<span
															className={classNames(
																s.leftAlignedItemLinkContentIcon,
																iconClassName
															)}
														>
															{icon}
														</span>
														<Text
															asElement="span"
															className={s.itemText}
															size={100}
															weight="regular"
														>
															{item.label}
														</Text>
													</div>
													{hasBadge && (
														<Badge
															color={item.badge.color}
															size="small"
															text={item.badge.text}
														/>
													)}
												</div>
											)

											return (
												<li className={s.itemContainer} key={itemId}>
													{linkHref ? (
														<Link href={linkHref}>
															<a
																aria-current={
																	isCurrentPage ? 'page' : undefined
																}
																aria-label={item.ariaLabel}
																className={s.itemLink}
																onKeyDown={handleKeyDown}
															>
																{anchorContent}
															</a>
														</Link>
													) : (
														<a
															aria-disabled
															aria-label={item.ariaLabel}
															className={s.itemLink}
															tabIndex={0}
														>
															{anchorContent}
														</a>
													)}
												</li>
											)
										}
									)}
								</ul>
								{showDivider && <hr className={s.itemGroupDivider} />}
							</Fragment>
						)
					}
				)}
			</div>
		</div>
	)
}

export default NavigationHeaderDropdownMenu

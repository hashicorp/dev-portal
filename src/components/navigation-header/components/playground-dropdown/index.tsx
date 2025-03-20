/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Fragment, KeyboardEvent, useRef, useState } from 'react'
import { useId } from '@react-aria/utils'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { useRouter } from 'next/router'
import { useCurrentProduct } from 'contexts'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnEscapeKeyDown from 'hooks/use-on-escape-key-down'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import deriveKeyEventState from 'lib/derive-key-event-state'
import Text from 'components/text'
import ProductIcon from 'components/product-icon'
import PLAYGROUND_CONFIG from 'data/playground.json'
import s from './playground-dropdown.module.css'
import { ProductSlug } from 'types/products'

// Define the type to match the structure in playground.json
type PlaygroundLab = {
	id?: string
	labId: string
	title: string
	description: string
	products: string[]
}

interface PlaygroundDropdownProps {
	ariaLabel: string
	label: string
}

const PlaygroundDropdown = ({ ariaLabel, label }: PlaygroundDropdownProps) => {
	const uniqueId = useId()
	const router = useRouter()
	const currentProduct = useCurrentProduct()
	const { openLab } = useInstruqtEmbed()
	const menuRef = useRef<HTMLDivElement>()
	const activatorButtonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(false)
	const [otherPlaygroundsOpen, setOtherPlaygroundsOpen] = useState(false)
	const menuId = `playground-dropdown-menu-${uniqueId}`

	// Item data from playground config
	const labs = PLAYGROUND_CONFIG.labs as PlaygroundLab[]

	// Filter labs for current product and other products
	const currentProductLabs = labs.filter((lab) =>
		lab.products.includes(currentProduct.slug)
	)

	const otherProductLabs = labs.filter(
		(lab) => !lab.products.includes(currentProduct.slug)
	)

	// Handles closing the menu if there is a click outside of it and it is open.
	useOnClickOutside([menuRef], () => setIsOpen(false), isOpen)

	// Handles closing the menu if focus moves outside of it and it is open.
	useOnFocusOutside([menuRef], () => setIsOpen(false), isOpen)

	// Handles closing the menu if Esc is pressed while navigating with a keyboard and the menu is focused.
	useOnEscapeKeyDown(
		[menuRef],
		() => {
			setIsOpen(false)
			activatorButtonRef.current.focus()
		},
		isOpen
	)

	// if the disclosure is open, handle closing it on `routeChangeStart`
	useOnRouteChangeStart({
		handler: () => setIsOpen(false),
		shouldListen: isOpen,
	})

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
	 * Handle lab selection
	 */
	const handleLabClick = (lab: PlaygroundLab) => {
		openLab(lab.labId)
		setIsOpen(false)
	}

	/**
	 * Navigate to the playground page
	 */
	const navigateToPlaygroundPage = (e: React.MouseEvent) => {
		e.preventDefault()
		router.push(`/${currentProduct.slug}/playground`)
		setIsOpen(false)
	}

	/**
	 * Toggle the other playgrounds accordion
	 */
	const toggleOtherPlaygrounds = (e: React.MouseEvent) => {
		e.preventDefault()
		setOtherPlaygroundsOpen(!otherPlaygroundsOpen)
	}

	return (
		<div className={s.root} onMouseLeave={handleMouseLeave} ref={menuRef}>
			<div className={s.activatorWrapper}>
				<button
					aria-controls={menuId}
					aria-expanded={isOpen}
					aria-label={ariaLabel}
					className={s.activator}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					onMouseEnter={handleMouseEnter}
					ref={activatorButtonRef}
				>
					<Text
						asElement="span"
						className={s.activatorText}
						size={200}
						weight="medium"
					>
						{label}
					</Text>
					<IconChevronDown16 className={s.activatorTrailingIcon} />
				</button>
			</div>
			<div
				className={s.dropdownContainer}
				id={menuId}
				style={{ display: isOpen ? 'block' : 'none' }}
			>
				<div className={s.dropdownContainerInner}>
					{/* Introduction to Playgrounds */}
					<div className={s.introSection}>
						<Text
							asElement="p"
							className={s.sectionTitle}
							size={200}
							weight="semibold"
						>
							HashiCorp Playgrounds
						</Text>
						<Text
							asElement="p"
							className={s.introText}
							size={100}
							weight="regular"
						>
							Interactive environments where you can experiment with HashiCorp
							products without any installation or setup. Perfect for learning,
							testing, and exploring features in a safe sandbox.
						</Text>

						{/* Learn more link */}
						<a
							href={`/${currentProduct.slug}/playground`}
							className={s.learnMoreLink}
							onClick={navigateToPlaygroundPage}
							onKeyDown={handleKeyDown}
						>
							<Text asElement="span" size={100} weight="medium">
								Learn more about Playgrounds
							</Text>
							<IconArrowRight16 className={s.learnMoreIcon} />
						</a>
					</div>

					{/* Divider */}
					<hr className={s.divider} />

					{/* Available Product Playgrounds Section */}
					<Text
						asElement="p"
						className={s.sectionTitle}
						size={200}
						weight="semibold"
					>
						Available {currentProduct.name} Playgrounds
					</Text>

					<ul className={s.labsList}>
						{currentProductLabs.map((lab, index) => (
							<li key={lab.id || index} className={s.itemContainer}>
								<button
									className={s.playgroundItem}
									onClick={() => handleLabClick(lab)}
									onKeyDown={handleKeyDown}
								>
									<ProductIcon productSlug={currentProduct.slug} />
									<div className={s.content}>
										<div className={s.titleRow}>
											<Text
												asElement="span"
												className={s.title}
												size={200}
												weight="regular"
											>
												{lab.title}
											</Text>
										</div>
										<Text
											asElement="span"
											className={s.description}
											size={100}
											weight="regular"
										>
											{lab.description}
										</Text>
									</div>
								</button>
							</li>
						))}
					</ul>

					{/* Other Playgrounds Accordion (only show if there are other playgrounds) */}
					{otherProductLabs.length > 0 && (
						<>
							<hr className={s.divider} />

							<button
								className={s.accordionButton}
								onClick={toggleOtherPlaygrounds}
								onKeyDown={handleKeyDown}
								aria-expanded={otherPlaygroundsOpen}
							>
								<Text
									asElement="span"
									className={s.sectionTitle}
									size={200}
									weight="semibold"
								>
									Other Playgrounds
								</Text>
								<IconChevronRight16
									className={`${s.accordionIcon} ${
										otherPlaygroundsOpen ? s.accordionIconOpen : ''
									}`}
								/>
							</button>

							{otherPlaygroundsOpen && (
								<ul className={s.labsList}>
									{otherProductLabs.map((lab, index) => (
										<li key={lab.id || index} className={s.itemContainer}>
											<button
												className={s.playgroundItem}
												onClick={() => handleLabClick(lab)}
												onKeyDown={handleKeyDown}
											>
												<ProductIcon
													productSlug={lab.products[0] as ProductSlug}
												/>
												<div className={s.content}>
													<div className={s.titleRow}>
														<Text
															asElement="span"
															className={s.title}
															size={200}
															weight="regular"
														>
															{lab.title}
														</Text>
													</div>
													<Text
														asElement="span"
														className={s.description}
														size={100}
														weight="regular"
													>
														{lab.description}
													</Text>
												</div>
											</button>
										</li>
									))}
								</ul>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default PlaygroundDropdown

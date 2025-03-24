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
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnEscapeKeyDown from 'hooks/use-on-escape-key-down'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import deriveKeyEventState from 'lib/derive-key-event-state'
import Text from 'components/text'
import ProductIcon from 'components/product-icon'
import SANDBOX_CONFIG from 'data/sandbox.json'
import s from './sandbox-dropdown.module.css'
import { ProductSlug } from 'types/products'

// Define the type to match the structure in sandbox.json
type SandboxLab = {
	id?: string
	labId: string
	title: string
	description: string
	products: string[]
}

interface SandboxDropdownProps {
	ariaLabel: string
	label: string
}

const SandboxDropdown = ({ ariaLabel, label }: SandboxDropdownProps) => {
	const uniqueId = useId()
	const router = useRouter()
	const currentProduct = useCurrentProduct()
	const { openLab } = useInstruqtEmbed()
	const menuRef = useRef<HTMLDivElement>()
	const activatorButtonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(false)
	const [otherSandboxesOpen, setOtherSandboxesOpen] = useState(false)
	const menuId = `sandbox-dropdown-menu-${uniqueId}`

	// Item data from sandbox config
	const labs = SANDBOX_CONFIG.labs as SandboxLab[]

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
	const handleLabClick = (lab: SandboxLab) => {
		openLab(lab.labId)
		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_STARTED, {
			labId: lab.labId,
			page: router.asPath,
		})
		setIsOpen(false)
	}

	/**
	 * Navigate to the sandbox page
	 */
	const navigateToSandboxPage = (e: React.MouseEvent) => {
		e.preventDefault()
		router.push(`/${currentProduct.slug}/sandbox`)
		setIsOpen(false)
	}

	/**
	 * Toggle the other sandboxes accordion
	 */
	const toggleOtherSandboxes = (e: React.MouseEvent) => {
		e.preventDefault()
		setOtherSandboxesOpen(!otherSandboxesOpen)
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
					{/* Introduction to Sandboxes */}
					<div className={s.introSection}>
						<Text
							asElement="p"
							className={s.sectionTitle}
							size={200}
							weight="semibold"
						>
							HashiCorp Sandboxes
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
							href={`/${currentProduct.slug}/sandbox`}
							className={s.learnMoreLink}
							onClick={navigateToSandboxPage}
							onKeyDown={handleKeyDown}
						>
							<Text asElement="span" size={100} weight="medium">
								Learn more about Sandboxes
							</Text>
							<IconArrowRight16 className={s.learnMoreIcon} />
						</a>
					</div>

					{/* Divider */}
					<hr className={s.divider} />

					{/* Available Product Sandboxes Section */}
					<Text
						asElement="p"
						className={s.sectionTitle}
						size={200}
						weight="semibold"
					>
						Available {currentProduct.name} Sandboxes
					</Text>

					<ul className={s.labsList}>
						{currentProductLabs.map((lab, index) => (
							<li key={lab.id || index} className={s.itemContainer}>
								<button
									className={s.sandboxItem}
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

					{/* Other Sandboxes Accordion (only show if there are other sandboxes) */}
					{otherProductLabs.length > 0 && (
						<>
							<hr className={s.divider} />

							<button
								className={s.accordionButton}
								onClick={toggleOtherSandboxes}
								onKeyDown={handleKeyDown}
								aria-expanded={otherSandboxesOpen}
							>
								<Text
									asElement="span"
									className={s.sectionTitle}
									size={200}
									weight="semibold"
								>
									Other Sandboxes
								</Text>
								<IconChevronRight16
									className={`${s.accordionIcon} ${
										otherSandboxesOpen ? s.accordionIconOpen : ''
									}`}
								/>
							</button>

							{otherSandboxesOpen && (
								<ul className={s.labsList}>
									{otherProductLabs.map((lab, index) => (
										<li key={lab.id || index} className={s.itemContainer}>
											<button
												className={s.sandboxItem}
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

export default SandboxDropdown

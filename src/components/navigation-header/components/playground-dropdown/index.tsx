/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Fragment, KeyboardEvent, useRef, useState } from 'react'
import { useId } from '@react-aria/utils'
import classNames from 'classnames'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnEscapeKeyDown from 'hooks/use-on-escape-key-down'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import { useRouter } from 'next/router'
import { useCurrentProduct } from 'contexts'
import Text from 'components/text'
import PlaygroundItem from '../playground-item'
import {
	NavigationHeaderIcon,
	NavigationHeaderItem,
} from 'components/navigation-header/types'
import { ProductSlug } from 'types/products'
import PLAYGROUND_CONFIG from 'data/playground.json'
import s from './playground-dropdown.module.css'

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
	 * Handles the menu being activated via a hover.
	 * Opens the menu.
	 */
	const handleMouseEnter = () => {
		setIsOpen(true)
	}

	/**
	 * Handles a keydown event on the activator button.
	 * Opens the menu for specific keystroke patterns.
	 */
	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (!isOpen) {
			const { isDown, isEnter, isSpace } = deriveKeyEventState(event)
			if (isDown || isEnter || isSpace) {
				event.preventDefault()
				setIsOpen(true)
			}
		}
	}

	/**
	 * Handle lab selection
	 */
	const handleLabClick = (lab: PlaygroundLab) => {
		openLab(lab.labId)
		setIsOpen(false)

		// Don't navigate away - just open the lab in the current page
		// This prevents issues with lab state being lost during navigation
	}

	/**
	 * Navigate to the playground page when clicking on the label
	 */
	const handleLabelClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		router.push(`/${currentProduct.slug}/playground`)
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
		<div
			className={s.root}
			ref={menuRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={() => setIsOpen(false)}
		>
			<div className={s.activatorContainer}>
				<button
					aria-controls={menuId}
					aria-expanded={isOpen}
					aria-label={ariaLabel}
					className={s.activator}
					onKeyDown={handleKeyDown}
					ref={activatorButtonRef}
					onClick={handleLabelClick}
				>
					<span className={s.label}>{label}</span>
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
								<PlaygroundItem
									item={{
										label: lab.title,
										description: lab.description,
										products: lab.products,
										path: '#',
										ariaLabel: lab.description,
										labId: lab.labId,
										onClick: () => handleLabClick(lab),
									}}
								/>
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
									className={classNames(s.accordionIcon, {
										[s.accordionIconOpen]: otherPlaygroundsOpen,
									})}
								/>
							</button>

							{otherPlaygroundsOpen && (
								<ul className={s.labsList}>
									{otherProductLabs.map((lab, index) => (
										<li key={lab.id || index} className={s.itemContainer}>
											<PlaygroundItem
												item={{
													label: lab.title,
													description: lab.description,
													products: lab.products,
													path: '#',
													ariaLabel: lab.description,
													labId: lab.labId,
													onClick: () => handleLabClick(lab),
												}}
											/>
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

// Helper function extracted from NavigationHeaderDropdownMenu
function deriveKeyEventState(event: KeyboardEvent<Element>) {
	const isDown = event.key === 'ArrowDown'
	const isUp = event.key === 'ArrowUp'
	const isLeft = event.key === 'ArrowLeft'
	const isRight = event.key === 'ArrowRight'
	const isEnter = event.key === 'Enter'
	const isEscape = event.key === 'Escape'
	const isHome = event.key === 'Home'
	const isEnd = event.key === 'End'
	const isSpace = event.key === ' '
	const isTab = event.key === 'Tab'

	return {
		isDown,
		isUp,
		isLeft,
		isRight,
		isEnter,
		isEscape,
		isHome,
		isEnd,
		isSpace,
		isTab,
	}
}

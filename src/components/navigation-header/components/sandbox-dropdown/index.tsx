/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { KeyboardEvent, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useId } from '@react-aria/utils'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
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
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json'
import s from './sandbox-dropdown.module.css'
import { SandboxLab } from 'types/sandbox'
import { ProductSlug } from 'types/products'
import { buildLabIdWithConfig } from 'lib/build-instruqt-url'
import { useTheme } from 'next-themes'
import { trackSandboxInteraction } from 'views/sandbox-view/utils'

interface SandboxDropdownProps {
	ariaLabel: string
	label: string
}

const SandboxDropdown = ({ ariaLabel, label }: SandboxDropdownProps) => {
	const uniqueId = useId()
	const router = useRouter()
	const currentProduct = useCurrentProduct()
	const { openLab, setActive } = useInstruqtEmbed()
	const rootRef = useRef<HTMLDivElement>()
	const menuRef = useRef<HTMLDivElement>()
	const activatorButtonRef = useRef<HTMLButtonElement>()
	const [isOpen, setIsOpen] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState<{
		top: number
		left: number
	} | null>(null)
	const [mounted, setMounted] = useState(false)
	const [isNavigating, setIsNavigating] = useState(false)
	const menuId = `sandbox-dropdown-menu-${uniqueId}`

	useEffect(() => {
		setMounted(true)
		return () => {
			setMounted(false)
			// Clean up state on unmount
			setIsOpen(false)
			setDropdownPosition(null)
		}
	}, [])

	// Reset dropdown state when product changes
	useEffect(() => {
		setIsOpen(false)
		setDropdownPosition(null)
	}, [currentProduct?.slug])

	// Close dropdown when product changes to prevent stale state
	useEffect(() => {
		setIsOpen(false)
		setDropdownPosition(null)
	}, [currentProduct?.slug])

	useEffect(() => {
		if (isOpen && activatorButtonRef.current) {
			const rect = activatorButtonRef.current.getBoundingClientRect()
			// Only set position if we have valid values
			if (
				rect &&
				typeof rect.bottom === 'number' &&
				typeof rect.left === 'number'
			) {
				setDropdownPosition({
					top: rect.bottom + 16,
					left: rect.left,
				})
			}
		} else if (!isOpen) {
			// Reset to null to ensure clean state
			setDropdownPosition(null)
		}
	}, [isOpen])

	// Item data from sandbox config
	const labs = SANDBOX_CONFIG.labs as unknown as SandboxLab[]

	const currentProductLabs = currentProduct?.slug
		? labs.filter((lab) => lab?.products?.includes(currentProduct.slug))
		: []

	const isOnSandboxPage = router.query?.productSlug === currentProduct?.slug

	// Handles closing the menu if there is a click outside of it and it is open.
	useOnClickOutside([rootRef, menuRef], () => setIsOpen(false), isOpen)

	// Handles closing the menu if focus moves outside of it and it is open.
	useOnFocusOutside([rootRef, menuRef], () => setIsOpen(false), isOpen)

	// Handles closing the menu if Esc is pressed while navigating with a keyboard and the menu is focused.
	useOnEscapeKeyDown(
		[rootRef, menuRef],
		() => {
			setIsOpen(false)
			activatorButtonRef.current?.focus()
		},
		isOpen
	)

	// Track navigation state to prevent concurrent navigations
	useEffect(() => {
		const handleRouteChangeStart = () => {
			setIsNavigating(true)
		}

		const handleRouteChangeComplete = () => {
			setIsNavigating(false)
		}

		const handleRouteChangeError = () => {
			setIsNavigating(false)
		}

		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
		router.events.on('routeChangeError', handleRouteChangeError)

		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart)
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
			router.events.off('routeChangeError', handleRouteChangeError)
		}
	}, [router.events])

	// if the disclosure is open, handle closing it on `routeChangeStart`
	useOnRouteChangeStart({
		handler: () => {
			setIsOpen(false)
			setDropdownPosition(null)
		},
		shouldListen: isOpen,
	})

	// Also handle route change errors (like aborted fetches) and route change complete
	useEffect(() => {
		if (!isOpen) return

		const handleRouteChange = () => {
			setIsOpen(false)
			setDropdownPosition(null)
		}

		router.events.on('routeChangeError', handleRouteChange)
		router.events.on('routeChangeComplete', handleRouteChange)

		return () => {
			router.events.off('routeChangeError', handleRouteChange)
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [isOpen, router.events])

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
			activatorButtonRef.current?.focus()
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

	const handleLabClick = (lab: SandboxLab) => {
		if (!lab || !lab.labId) {
			console.error('[SandboxDropdown] Invalid lab data:', lab)
			return
		}

		const fullLabId = buildLabIdWithConfig(lab)

		openLab(fullLabId)
		setActive(true)

		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
			labId: fullLabId,
			page: router.asPath,
		})

		setIsOpen(false)
		setDropdownPosition(null)
	}

	const navigateToSandboxPage = (e: React.MouseEvent) => {
		e.preventDefault()

		// Guard against undefined currentProduct
		if (!currentProduct?.slug) {
			console.error('[SandboxDropdown] currentProduct is undefined')
			return
		}

		// Prevent navigation if already navigating (avoids route cancellation errors)
		if (isNavigating) {
			console.log('[SandboxDropdown] Navigation already in progress, skipping')
			return
		}

		setIsOpen(false)
		setDropdownPosition(null)

		router.push(`/${currentProduct.slug}/sandbox`).catch((error) => {
			// Handle route cancellation errors gracefully (though should be rare now)
			if (error.cancelled) {
				console.log('[SandboxDropdown] Route change was cancelled')
			} else {
				console.error('[SandboxDropdown] Route change error:', error)
			}
		})
	}

	const { theme, systemTheme } = useTheme()
	const isLightTheme =
		theme === 'light' || (theme === 'system' && systemTheme === 'light')

	// Don't render if currentProduct is not available (after all hooks are called)
	if (!currentProduct || !currentProduct.slug) {
		return null
	}
	return (
		<div
			className={`${s.root} ${isLightTheme ? 'theme-light' : 'theme-dark'}`}
			style={
				isLightTheme
					? ({
							'--intro-bg': '#fafafa',
							'--intro-border': '#656a7633',
					  } as React.CSSProperties)
					: undefined
			}
			onMouseLeave={handleMouseLeave}
			ref={rootRef}
		>
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
			{mounted &&
				isOpen &&
				dropdownPosition &&
				typeof dropdownPosition.top === 'number' &&
				typeof dropdownPosition.left === 'number' &&
				createPortal(
					<div
						className={s.dropdownContainer}
						id={menuId}
						style={{
							top: `${dropdownPosition.top}px`,
							left: `${dropdownPosition.left}px`,
						}}
						ref={menuRef}
					>
						<div className={s.dropdownContainerInner}>
							<button
								className={`${s.introSandboxItem} ${s.sandboxItem}`}
								onClick={navigateToSandboxPage}
								onKeyDown={handleKeyDown}
								aria-label={`Go to ${currentProduct.name} Sandboxes`}
								aria-current={isOnSandboxPage ? 'page' : undefined}
							>
								<div className={s.introSandboxRow}>
									<ProductIcon
										productSlug={currentProduct.slug as ProductSlug}
										size={16}
										className={s.productIcon}
									/>
									<Text
										asElement="span"
										className={`${s.sectionTitle} ${s.introSandboxTitle} ${s.title}`}
										size={200}
										weight="semibold"
									>
										{currentProduct.name} Sandboxes
									</Text>
								</div>
								<Text
									asElement="span"
									className={`${s.introText} ${s.introSandboxText} ${s.description}`}
									size={100}
									weight="regular"
								>
									Interactive environments where you can experiment with
									HashiCorp products without any installation or setup. Perfect
									for learning, testing, and exploring features in a safe
									sandbox.
								</Text>
							</button>

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
									<li key={lab.labId || index} className={s.itemContainer}>
										<button
											className={s.sandboxItem}
											onClick={() => {
												handleLabClick(lab)
												trackSandboxInteraction('hover', lab.labId, {
													page: router.asPath,
												})
											}}
											onKeyDown={handleKeyDown}
										>
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
													<div className={s.productIcons}>
														{lab.products.map((product) => (
															<ProductIcon
																key={`${lab.labId}-${product}`}
																productSlug={product as ProductSlug}
																size={16}
																className={s.productIcon}
															/>
														))}
													</div>
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
						</div>
					</div>,
					document.body
				)}
		</div>
	)
}

export default SandboxDropdown

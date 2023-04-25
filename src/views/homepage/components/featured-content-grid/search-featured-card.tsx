import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import deriveKeyEventState from 'lib/derive-key-event-state'
import usePrefersReducedMotion from 'lib/hooks/usePrefersReducedMotion'
import Card from 'components/card'
import { useCommandBar } from 'components/command-bar'
import Heading from 'components/heading'
import { StandaloneLinkContents } from 'components/standalone-link'
import Text from 'components/text'
import s from './search-featured-card.module.css'

const FEATURED_SEARCH_TERMS = [
	'Consul Kubernetes Helm Chart',
	'Vault AppRole Auth Method',
	'Nomad Service Discovery',
	'Terraform Variables',
	'Cloud Operating Model',
]

// Starting the animation from the center, as requested from Design
const INITIALLY_CENTERED_TERM_INDEX = 2

const SearchFeaturedCard = () => {
	const prefersReducedMotion = usePrefersReducedMotion()
	const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(
		!prefersReducedMotion
	)
	const {
		isOpen: isCommandBarOpen,
		setCurrentInputValue: setCommandBarSearchValue,
		toggleIsOpen: toggleCommandBar,
	} = useCommandBar()
	const scrollableAreaRef = useRef<HTMLDivElement>()
	const [currentIndex, setCurrentIndex] = useState(
		INITIALLY_CENTERED_TERM_INDEX
	)

	/**
	 * Keep the animation enabled/disabled state in sync with changes to the
	 * `prefers-reduced-motion` setting. If a user updates their setting while the
	 * page is open, the enabled/disabled state will update to respect the
	 * setting's new value.
	 */
	useEffect(() => {
		setIsAutoScrollEnabled(!prefersReducedMotion)
	}, [prefersReducedMotion])

	/**
	 * If animation is enabled, set up the animation interval and event listeners
	 * that are used to disable the animation with certain interactions.
	 *
	 * If the animation has been disabled, set up event listeners that are used to
	 * re-enable the animation with certain interactions.
	 */
	useEffect(() => {
		// Never set up listeners if a user prefers reduced motion
		if (prefersReducedMotion) {
			return
		}

		/**
		 * Pull element into a variable to prevent specific React warning:
		 *
		 * "The ref value 'scrollableAreaRef.current' will likely have changed by
		 * the time this effect cleanup function runs. If this ref points to a node
		 * rendered by React, copy 'scrollableAreaRef.current' to a variable inside
		 * the effect, and use that variable in the cleanup function.""
		 */
		const scrollableElementParent = scrollableAreaRef.current.parentElement

		// Create focus & pointer listener
		const interactionListener = () => {
			if (isAutoScrollEnabled) {
				setIsAutoScrollEnabled(false)
				return
			}

			// If CommandBar is open, do not auto scroll scrolling
			const canReenable = !isCommandBarOpen
			if (!isAutoScrollEnabled && canReenable) {
				setIsAutoScrollEnabled(true)
				return
			}
		}

		// Derive the event listener types from isAutoScrollEnabled
		let focusListenerType
		let pointerListenerType
		if (isAutoScrollEnabled) {
			focusListenerType = 'focusin'
			pointerListenerType = 'pointerenter'
		} else {
			focusListenerType = 'focusout'
			pointerListenerType = 'pointerleave'
		}

		// Add the event listeners to the necessary elements
		scrollableElementParent.addEventListener(
			focusListenerType,
			interactionListener
		)
		scrollableElementParent.addEventListener(
			pointerListenerType,
			interactionListener
		)

		// If auto scroll is enabeld, set up the animation interval
		let interval: NodeJS.Timer
		if (isAutoScrollEnabled) {
			interval = setInterval(() => {
				setCurrentIndex((prev: number) => {
					const isLastIndex = FEATURED_SEARCH_TERMS.length - 1
					if (prev === isLastIndex) {
						return 0
					} else {
						return prev + 1
					}
				})
			}, 4000)
		}

		// Clean up the listeners and interval
		return () => {
			scrollableElementParent.removeEventListener(
				focusListenerType,
				interactionListener
			)
			scrollableElementParent.removeEventListener(
				pointerListenerType,
				interactionListener
			)
			clearInterval(interval)
		}
	}, [isAutoScrollEnabled, isCommandBarOpen, prefersReducedMotion])

	/**
	 * When `currentIndex` changes, check if the button at that index is centered.
	 * If it's not, then center it.
	 */
	useEffect(() => {
		const { left: containerLeft, width: containerWidth } =
			scrollableAreaRef.current.getBoundingClientRect()
		const { left: buttonLeft, width: buttonWidth } =
			scrollableAreaRef.current.children
				.item(currentIndex)
				.getBoundingClientRect()

		const widthDifference = containerWidth - buttonWidth
		const buttonLeftWhenCentered = containerLeft + widthDifference / 2

		const buttonOffsetFromCenter = buttonLeft - buttonLeftWhenCentered
		if (Math.abs(buttonOffsetFromCenter) > 10) {
			scrollableAreaRef.current.scrollBy(buttonOffsetFromCenter, 0)
		}
	}, [currentIndex])

	return (
		<Card className={s.root} elevation="mid">
			<h2 className={s.heading}>Search with ease</h2>
			<Text className={s.description} size={200} weight="medium">
				<span>Find examples, reference material,</span>
				<span>and architecture guidance</span>
			</Text>
			<div className={s.carousel}>
				<div className={s.blurredBackground} />
				<div className={s.fadedBackground} />
				<div className={s.buttonContainer} ref={scrollableAreaRef}>
					{FEATURED_SEARCH_TERMS.map((term: string, index: number) => {
						const id = `search-term-${index}`
						const isCurrent = index === currentIndex
						const handleClick = () => {
							if (isCurrent) {
								setCommandBarSearchValue(FEATURED_SEARCH_TERMS[index])
								toggleCommandBar()
							} else {
								setCurrentIndex(index)
							}
						}
						const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
							const { isShiftTabKey, isTabKey } = deriveKeyEventState(event)
							if (isShiftTabKey || isTabKey) {
								setCurrentIndex(index)
							}
						}

						return (
							<button
								id={id}
								key={id}
								className={classNames(s.button, isCurrent && s.currentButton)}
								onClick={handleClick}
								onKeyUp={handleKeyUp}
							>
								<div className={s.buttonContent}>
									<Text
										asElement="span"
										className={s.buttonText}
										size={200}
										weight="semibold"
									>
										{term}
									</Text>
									<StandaloneLinkContents
										color="primary"
										icon={<IconArrowRight16 />}
										iconPosition="trailing"
										text="Explore"
									/>
								</div>
							</button>
						)
					})}
				</div>
				{/**
				 * This element serves 2 purposes:
				 *  - a visual indicator of position in the list of search term buttons
				 *  - additional way to change position using a click, tap, etc.
				 *
				 * The clickable elements are intentionally hidden from keyboard and
				 * screen reader users. These users have already navigated through the
				 * list of buttons, so they do not need 5 extra TAB stops.
				 *
				 * From MDN web docs:
				 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
				 *
				 * > "Use caution when using aria-hidden to hide visibly rendered
				 *   content from assistive technologies. You should not be hiding
				 *   visible content unless doing so improves the experience for users
				 *   of assistive technologies by removing redundant or extraneous
				 *   content. Only when identical or equivalent meaning and
				 *   functionality is exposed to assistive technologies can removing
				 *   visible content from the accessibility API be considered."
				 */}
				<div aria-hidden className={s.positionIndicatorBar}>
					{FEATURED_SEARCH_TERMS.map((_: string, index: number) => {
						const id = `position-indicator-${index}`
						const isCurrent = index === currentIndex
						const classes = classNames(
							s.positionIndicator,
							isCurrent && s.currentPositionIndicator
						)
						return (
							<div
								className={s.positionIndicatorContainer}
								key={id}
								onClick={() => setCurrentIndex(index)}
							>
								<div className={classes} />
							</div>
						)
					})}
				</div>
			</div>
		</Card>
	)
}

export default SearchFeaturedCard

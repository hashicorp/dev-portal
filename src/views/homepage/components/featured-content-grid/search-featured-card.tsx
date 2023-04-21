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
	const scrollableAreaRef = useRef<HTMLDivElement>()
	const [currentIndex, setCurrentIndex] = useState(
		INITIALLY_CENTERED_TERM_INDEX
	)
	const prefersReducedMotion = usePrefersReducedMotion()
	const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(
		!prefersReducedMotion
	)
	const { setCurrentInputValue, toggleIsOpen } = useCommandBar()

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
	 */
	useEffect(() => {
		// Nothing to do if animation is already disabled
		if (isAutoScrollEnabled === false) {
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
		const scrollableElement = scrollableAreaRef.current

		// Create focus & pointer listener
		const interactionListener = (event: FocusEvent | PointerEvent) => {
			const isInteractionInside = scrollableElement.contains(
				event.target as Node
			)
			if (isInteractionInside) {
				setIsAutoScrollEnabled(false)
			}
		}

		// Add the listener for events that should disable animation
		document.addEventListener('focusin', interactionListener)
		scrollableElement.addEventListener('pointerenter', interactionListener)

		// Set up the animation interval
		const interval = setInterval(() => {
			setCurrentIndex((prev: number) => {
				if (prev === FEATURED_SEARCH_TERMS.length - 1) {
					return 0
				} else {
					return prev + 1
				}
			})
		}, 4000)

		// Clean up the listeners and interval
		return () => {
			document.removeEventListener('focusin', interactionListener)
			scrollableElement.removeEventListener('pointerenter', interactionListener)
			clearInterval(interval)
		}
	}, [isAutoScrollEnabled])

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
			<Heading className={s.heading} level={2} size={400} weight="bold">
				Search with ease
			</Heading>
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
								setCurrentInputValue(FEATURED_SEARCH_TERMS[index])
								toggleIsOpen()
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
								onClick={() => {
									setIsAutoScrollEnabled(false)
									setCurrentIndex(index)
								}}
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

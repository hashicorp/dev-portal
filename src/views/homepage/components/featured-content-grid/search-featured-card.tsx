import { useEffect, useRef, useState } from 'react'
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

const SearchFeaturedCard = () => {
	const scrollableAreaRef = useRef<HTMLDivElement>()
	const [currentIndex, setCurrentIndex] = useState(0)
	const prefersReducedMotion = usePrefersReducedMotion()
	const [isAnimationEnabled, setIsAnimationEnabled] = useState(
		!prefersReducedMotion
	)
	const { setCurrentInputValue, toggleIsOpen } = useCommandBar()

	useEffect(() => {
		setIsAnimationEnabled(!prefersReducedMotion)
	}, [prefersReducedMotion])

	useEffect(() => {
		if (isAnimationEnabled === false) {
			return
		}

		const interactionListener = (event: $TSFixMe) => {
			const isInteractionInside = scrollableAreaRef.current.contains(
				event.target as Node
			)
			if (isInteractionInside) {
				setIsAnimationEnabled(false)
			}
		}

		document.addEventListener('focusin', interactionListener)
		scrollableAreaRef.current.addEventListener(
			'pointerenter',
			interactionListener
		)

		const interval = setInterval(() => {
			setCurrentIndex((prev: number) => {
				if (prev === FEATURED_SEARCH_TERMS.length - 1) {
					return 0
				} else {
					return prev + 1
				}
			})
		}, 4000)

		return () => {
			clearInterval(interval)
			document.removeEventListener('focusin', interactionListener)
			scrollableAreaRef.current.removeEventListener(
				'pointerenter',
				interactionListener
			)
		}
	}, [isAnimationEnabled])

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
		<Card className={s.root} elevation="base">
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
					{FEATURED_SEARCH_TERMS.map((term, index) => {
						const id = `search-term-${index}`
						const isCurrent = index === currentIndex
						return (
							<button
								id={id}
								key={id}
								className={classNames(s.button, isCurrent && s.currentButton)}
								onClick={() => {
									if (isCurrent) {
										setCurrentInputValue(FEATURED_SEARCH_TERMS[index])
										toggleIsOpen()
									} else {
										setCurrentIndex(index)
									}
								}}
								onKeyUp={(e) => {
									const { isShiftTabKey, isTabKey } = deriveKeyEventState(e)
									if (isShiftTabKey || isTabKey) {
										setCurrentIndex(index)
									}
								}}
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
				<div className={s.positionIndicatorBar}>
					{FEATURED_SEARCH_TERMS.map((_, index) => {
						const id = `position-indicator-${index}`
						return (
							<div
								className={classNames(
									s.positionIndicator,
									index === currentIndex && s.currentPositionIndicator
								)}
								key={id}
							/>
						)
					})}
				</div>
			</div>
		</Card>
	)
}

export default SearchFeaturedCard

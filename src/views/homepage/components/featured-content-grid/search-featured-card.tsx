import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
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
	const previousIndex = useRef(0)
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

	useEffect(() => {
		if (previousIndex.current === currentIndex) {
			return
		}

		let scrollDirectionMultiplier: -1 | 1
		if (currentIndex > previousIndex.current) {
			scrollDirectionMultiplier = 1
		} else {
			scrollDirectionMultiplier = -1
		}

		if (
			currentIndex === 0 &&
			previousIndex.current === FEATURED_SEARCH_TERMS.length - 1
		) {
			scrollableAreaRef.current.scrollTo(0, 0)
		} else if (
			currentIndex === FEATURED_SEARCH_TERMS.length - 1 &&
			previousIndex.current === 0
		) {
			scrollableAreaRef.current.scrollTo(
				scrollableAreaRef.current.scrollWidth,
				0
			)
		} else {
			const { width } =
				scrollableAreaRef.current.children[
					previousIndex.current
				].getBoundingClientRect()
			scrollableAreaRef.current.scrollBy(scrollDirectionMultiplier * width, 0)
		}

		previousIndex.current = currentIndex
	}, [currentIndex])

	/**
	 * @TODO abstract the "is centered" logic to share in effect too
	 */
	const handleClickOrFocus = (type: 'click' | 'focus', buttonIndex: number) => {
		setIsAnimationEnabled(false)

		const buttonsContainer = scrollableAreaRef.current
		const buttonChildren = Array.from(buttonsContainer.children)
		const buttonInteractedWith = buttonChildren[buttonIndex]

		const containerRectangle = buttonsContainer.getBoundingClientRect()
		const buttonRectangle = buttonInteractedWith.getBoundingClientRect()

		const leftPaddingIfCentered =
			(containerRectangle.width - buttonRectangle.width) / 2
		const currentLeftPadding = buttonRectangle.left - containerRectangle.left
		const paddingDifference = leftPaddingIfCentered - currentLeftPadding

		if (Math.abs(paddingDifference) > 10) {
			setCurrentIndex(buttonIndex)
		} else if (type === 'click') {
			setCurrentInputValue(FEATURED_SEARCH_TERMS[buttonIndex])
			toggleIsOpen()
		}
	}

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
								onClick={() => handleClickOrFocus('click', index)}
								onFocus={() => handleClickOrFocus('focus', index)}
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

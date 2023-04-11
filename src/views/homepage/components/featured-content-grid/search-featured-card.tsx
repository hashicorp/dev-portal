import { useRef, useState } from 'react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import useSafeLayoutEffect from 'hooks/use-safe-layout-effect'
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
	const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
	const [currentIndex, setCurrentIndex] = useState(0)
	const { setCurrentInputValue, toggleIsOpen } = useCommandBar()

	useSafeLayoutEffect(() => {
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

		return () => {
			document.removeEventListener('focusin', interactionListener)
			scrollableAreaRef.current.removeEventListener(
				'pointerenter',
				interactionListener
			)
		}
	}, [isAnimationEnabled])

	useSafeLayoutEffect(() => {
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

	useSafeLayoutEffect(() => {
		if (!isAnimationEnabled) {
			return
		}

		const interval = setInterval(() => {
			setCurrentIndex((prev: number) => {
				if (prev === FEATURED_SEARCH_TERMS.length - 1) {
					return 0
				} else {
					return prev + 1
				}
			})
		}, 4000)

		return () => clearInterval(interval)
	}, [isAnimationEnabled])

	return (
		<Card className={s.searchCard} elevation="base">
			<div className={s.searchCardText}>
				<Heading level={2} size={400} weight="bold">
					Search with ease
				</Heading>
				<Text size={200} weight="medium">
					Explore highly regarded resources
					<br />
					on a wide range of topics.
				</Text>
			</div>
			<div className={s.searchCardCarousel}>
				<div className={s.searchCardCarouselBackground} />
				<div className={s.fadedBackground} />
				<div className={s.searchCardButtonContainer} ref={scrollableAreaRef}>
					{FEATURED_SEARCH_TERMS.map((term, index) => {
						const id = `search-term-${index}`
						return (
							<button
								id={id}
								key={id}
								className={s.searchCardButton}
								onClick={() => {
									setIsAnimationEnabled(false)
									if (index === currentIndex) {
										setCurrentInputValue(term)
										toggleIsOpen()
									} else {
										setCurrentIndex(index)
									}
								}}
								tabIndex={index === currentIndex ? 0 : -1}
							>
								<div className={s.buttonContent}>
									<Text
										asElement="span"
										size={200}
										weight="semibold"
										style={{ whiteSpace: 'nowrap' }}
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
			</div>
		</Card>
	)
}

export default SearchFeaturedCard

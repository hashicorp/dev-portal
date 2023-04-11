/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { useRef, useState } from 'react'
import Image from 'next/image'
import classNames from 'classnames'

// HashiCorp imports
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import hcpLogo from '@hashicorp/mktg-logos/product/hcp/primary/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import useSafeLayoutEffect from 'hooks/use-safe-layout-effect'
import Card from 'components/card'
import CardLink from 'components/card-link'
import { useCommandBar } from 'components/command-bar'
import Heading from 'components/heading'
import { StandaloneLinkContents } from 'components/standalone-link'
import Text from 'components/text'

// Local imports
import certificationsGraphic from '../../img/certifications-graphic.svg'
import wafGraphic from '../../img/waf-graphic.svg?include'
import s from './featured-content-grid.module.css'

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
				<div
					className={s.searchCardButtonContainer}
					ref={scrollableAreaRef}
					id="my-test-thing"
				>
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
							</button>
						)
					})}
				</div>
			</div>
		</Card>
	)
}

const FeaturedCard = ({ children, className, href, title }: $TSFixMe) => {
	return (
		<CardLink
			ariaLabel={title}
			className={classNames(s.card, className)}
			href={href}
		>
			<div>{children}</div>
			<div className={s.learnMoreCta}>
				<Text size={300} weight="medium">
					Learn More
				</Text>
				<IconArrowRight24 />
			</div>
		</CardLink>
	)
}

const CertificationsFeaturedCard = () => {
	const title = 'Get HashiCorp certified'

	return (
		<FeaturedCard
			className={s.certificationsCard}
			href="/certifications"
			title={title}
		>
			<div className={s.certificationsCardContent}>
				<Image
					alt=""
					className={s.certificationsGraphic}
					height={286}
					src={certificationsGraphic}
					width={373}
				/>
				<div className={s.certificationsCardContentText}>
					<Heading level={2} size={400} weight="bold">
						{title}
					</Heading>
					<Text asElement="p" size={300} weight="regular">
						Earn certifications to verify your skills and communicate your
						proficiency with HashiCorp multi-cloud products.
					</Text>
				</div>
			</div>
		</FeaturedCard>
	)
}

/**
 * @TODO The graphic for this component needs refined, but that will take some
 * Design work in Figma. Will resolve in VQA.
 */
const HcpFeaturedCard = () => {
	const title = 'HashiCorp Cloud Platform'

	return (
		<FeaturedCard className={s.hcpCard} href="/hcp" title={title}>
			<h2 aria-label={title} className={s.hcpCardTitle}>
				<InlineSvg aria-hidden="true" className={s.hcpLogo} src={hcpLogo} />
			</h2>
			<p className={s.hcpCardBody}>
				The fastest way to get up and running with HashiCorp products
			</p>
		</FeaturedCard>
	)
}

const WafFeaturedCard = () => {
	const title = 'What is HashiCorp’s Well-Architected Framework?'

	return (
		<FeaturedCard
			className={s.wafCard}
			href="/well-architected-framework"
			title={title}
		>
			<div className={s.wafCardContent}>
				<InlineSvg className={s.wafGraphic} src={wafGraphic} />
				<Heading level={2} size={400} weight="bold">
					{title}
				</Heading>
			</div>
		</FeaturedCard>
	)
}

const FeaturedContentGrid = () => {
	return (
		<div className={s.root}>
			<div className={s.gridAreaA}>
				<SearchFeaturedCard />
			</div>
			<div className={s.gridAreaB}>
				<CertificationsFeaturedCard />
			</div>
			<div className={s.gridAreaC}>
				<HcpFeaturedCard />
			</div>
			<div className={s.gridAreaD}>
				<WafFeaturedCard />
			</div>
		</div>
	)
}

export { FeaturedContentGrid }

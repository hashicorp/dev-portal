/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import Image from 'next/image'
import classNames from 'classnames'

// HashiCorp imports
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import hcpLogo from '@hashicorp/mktg-logos/product/hcp/primary/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
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
	const { setCurrentInputValue, toggleIsOpen } = useCommandBar()

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
				<ul className={s.searchCardList}>
					{FEATURED_SEARCH_TERMS.map((featuredSearchTerm: string) => (
						<li className={s.searchCardListItem} key={featuredSearchTerm}>
							<button
								className={s.searchCardButton}
								onClick={() => {
									setCurrentInputValue(featuredSearchTerm)
									toggleIsOpen()
								}}
							>
								<Text asElement="span" size={200} weight="semibold">
									{featuredSearchTerm}
								</Text>
								<StandaloneLinkContents
									color="primary"
									icon={<IconArrowRight16 />}
									iconPosition="trailing"
									text="Explore"
								/>
							</button>
						</li>
					))}
				</ul>
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

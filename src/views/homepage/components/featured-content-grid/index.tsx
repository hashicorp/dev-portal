import Image from 'next/image'
import classNames from 'classnames'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import hcpLogo from '@hashicorp/mktg-logos/product/hcp/primary/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import Card from 'components/card'
import CardLink from 'components/card-link'
import { useCommandBar } from 'components/command-bar'
import Heading from 'components/heading'
import Text from 'components/text'
import certificationsGraphic from '../../img/certifications-graphic.svg'
import s from './featured-content-grid.module.css'

const FEATURED_SEARCH_TERMS = [
	'Consul Kubernetes Helm Chart',
	'Vault AppRole Auth Method',
	'Nomad Service Discovery',
	'Terraform Variables',
	'Cloud Operating Model',
]

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

const FeaturedContentGrid = () => {
	const { setCurrentInputValue, toggleIsOpen } = useCommandBar()

	return (
		<div className={s.root}>
			<div className={s.gridAreaA}>
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
						<ul>
							{FEATURED_SEARCH_TERMS.map((featuredSearchTerm: string) => (
								<li key={featuredSearchTerm}>
									<button
										onClick={() => {
											setCurrentInputValue(featuredSearchTerm)
											toggleIsOpen()
										}}
									>
										{featuredSearchTerm}
									</button>
								</li>
							))}
						</ul>
					</div>
				</Card>
			</div>
			<div className={s.gridAreaB}>
				<FeaturedCard
					className={s.certificationsCard}
					href="/certifications"
					title="Get HashiCorp certified"
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
								Get HashiCorp certified
							</Heading>
							<Text asElement="p" size={300} weight="regular">
								Earn certifications to verify your skills and communicate your
								proficiency with HashiCorp multi-cloud products.
							</Text>
						</div>
					</div>
				</FeaturedCard>
			</div>
			<div className={s.gridAreaC}>
				<HcpFeaturedCard />
			</div>
			<div className={s.gridAreaD}>
				<FeaturedCard
					href="/well-architected-framework"
					title="What is HashiCorp’s Well-Architected Framework?"
				>
					<h2>What is HashiCorp’s Well-Architected Framework?</h2>
				</FeaturedCard>
			</div>
		</div>
	)
}

export { FeaturedContentGrid }

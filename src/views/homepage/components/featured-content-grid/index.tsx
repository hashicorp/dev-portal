import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import Card from 'components/card'
import { useCommandBar } from 'components/command-bar'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './featured-content-grid.module.css'

const FEATURED_SEARCH_TERMS = [
	'Consul Kubernetes Helm Chart',
	'Vault AppRole Auth Method',
	'Nomad Service Discovery',
	'Terraform Variables',
	'Cloud Operating Model',
]

const FeaturedCard = ({ children }: $TSFixMe) => {
	return (
		<div className={s.card}>
			<div>{children}</div>
			<div className={s.learnMoreCta}>
				<Text size={300} weight="medium">
					Learn More
				</Text>
				<IconArrowRight24 />
			</div>
		</div>
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
				<FeaturedCard>
					<h2>Get HashiCorp certified</h2>
					<p>
						Earn certifications to verify your skills and communicate your
						proficiency with HashiCorp multi-cloud products.
					</p>
				</FeaturedCard>
			</div>
			<div className={s.gridAreaC}>
				<FeaturedCard>
					<h2>HashiCorp Cloud Platform</h2>
					<p>The fastest way to get up and running with HashiCorp products</p>
				</FeaturedCard>
			</div>
			<div className={s.gridAreaD}>
				<FeaturedCard>
					<h2>What is HashiCorp’s Well-Architected Framework?</h2>
				</FeaturedCard>
			</div>
		</div>
	)
}

export { FeaturedContentGrid }

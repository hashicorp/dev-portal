/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
				<Card className={s.card}>
					<h2>Get HashiCorp certified</h2>
					<p>
						Earn certifications to verify your skills and communicate your
						proficiency with HashiCorp multi-cloud products.
					</p>
					<p>Learn more</p>
				</Card>
			</div>
			<div className={s.gridAreaC}>
				<Card className={s.card}>
					<h2>HashiCorp Cloud Platform</h2>
					<p>The fastest way to get up and running with HashiCorp products</p>
					<p>Learn more</p>
				</Card>
			</div>
			<div className={s.gridAreaD}>
				<Card className={s.card}>
					<h2>What is HashiCorp’s Well-Architected Framework?</h2>
					<p>Learn more</p>
				</Card>
			</div>
		</div>
	)
}

export { FeaturedContentGrid }

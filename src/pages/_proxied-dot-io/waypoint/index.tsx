import * as React from 'react'
import { proxiedRivetClient } from 'lib/cms'
import Head from 'next/head'
import { renderMetaTags } from '@hashicorp/react-head'
import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import IoHomeHero from 'components/_proxied-dot-io/common/io-home-hero'
import IoHomeIntro from 'components/_proxied-dot-io/common/io-home-intro'
import IoHomeInPractice from 'components/_proxied-dot-io/common/io-home-in-practice'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoHomeCaseStudies from 'components/_proxied-dot-io/common/io-home-case-studies'
import IoHomeCallToAction from 'components/_proxied-dot-io/common/io-home-call-to-action'
import IoHomePreFooter from 'components/_proxied-dot-io/common/io-home-pre-footer'
import homepageQuery from './query.graphql'
import s from './style.module.css'

export default function WaypointHomepage({ data }): React.ReactElement {
	const {
		seo,
		heroHeading,
		heroDescription,
		heroCtas,
		heroCards,
		introHeading,
		introDescription,
		introFeatures,
		introVideo,
		inPracticeHeading,
		inPracticeDescription,
		inPracticeCards,
		useCasesHeading,
		useCasesDescription,
		useCases,
		caseStudiesHeading,
		caseStudiesDescription,
		caseStudiesFeatured,
		caseStudiesLinks,
		callToActionHeading,
		callToActionDescription,
		callToActionCtas,
		preFooterHeading,
		preFooterDescription,
		preFooterCtas,
	} = data
	const _introVideo = introVideo[0]

	return (
		<>
			<Head>{renderMetaTags(seo)}</Head>

			<IoHomeHero
				pattern={require('/public/waypoint-public/img/home-hero-pattern.svg')}
				brand="waypoint"
				heading={heroHeading}
				description={heroDescription}
				ctas={heroCtas}
				cards={heroCards.map((card) => {
					return {
						...card,
						cta: card.cta[0],
					}
				})}
			/>

			<IoHomeIntro
				brand="waypoint"
				heading={introHeading}
				description={introDescription}
				features={introFeatures}
				video={{
					youtubeId: _introVideo?.youtubeId,
					thumbnail: _introVideo?.thumbnail?.url,
					heading: _introVideo?.heading,
					description: _introVideo?.description,
					person: {
						name: _introVideo?.personName,
						description: _introVideo?.personDescription,
						avatar: _introVideo?.personAvatar?.url,
					},
				}}
			/>

			{useCases.length > 0 ? (
				<section className={s.useCases}>
					<div className={s.container}>
						<IoCardContainer
							heading={useCasesHeading}
							description={useCasesDescription}
							cardsPerRow={4}
							cards={useCases.map((usecase) => {
								return {
									link: {
										url: `/use-cases/${usecase.slug}`,
										type: 'inbound',
									},
									heading: usecase.heroHeading,
									description: usecase.heroDescription,
								}
							})}
						/>
					</div>
				</section>
			) : null}

			<IoHomeInPractice
				brand="waypoint"
				pattern={require('/public/waypoint-public/img/practice-pattern.svg')}
				heading={inPracticeHeading}
				description={inPracticeDescription}
				cards={inPracticeCards.map((card) => {
					return {
						eyebrow: card.eyebrow,
						link: {
							url: card.link,
							type: 'inbound',
						},
						heading: card.heading,
						description: card.description,
						products: card.products,
					}
				})}
			/>

			<IoHomeCaseStudies
				heading={caseStudiesHeading}
				description={caseStudiesDescription}
				primary={caseStudiesFeatured}
				secondary={caseStudiesLinks}
			/>

			<IoHomeCallToAction
				brand="waypoint"
				heading={callToActionHeading}
				content={callToActionDescription}
				links={callToActionCtas}
			/>

			<IoHomePreFooter
				brand="waypoint"
				heading={preFooterHeading}
				description={preFooterDescription}
				ctas={preFooterCtas}
			/>
		</>
	)
}
WaypointHomepage.layout = WaypointIoLayout

export async function getStaticProps() {
	const query = proxiedRivetClient('waypoint')
	const { waypointHomepage } = await query({
		query: homepageQuery,
	})

	return {
		props: {
			data: waypointHomepage,
		},
		revalidate:
			process.env.HASHI_ENV === 'production'
				? process.env.GLOBAL_REVALIDATE
				: 10,
	}
}

import * as React from 'react'
import { proxiedRivetClient } from 'lib/cms'
import Head from 'next/head'
import { renderMetaTags } from '@hashicorp/react-head'
import IoHomeHero from 'components/_proxied-dot-io/common/io-home-hero'
import IoHomeIntro from 'components/_proxied-dot-io/common/io-home-intro'
import IoHomeInPractice from 'components/_proxied-dot-io/common/io-home-in-practice'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoHomeCaseStudies from 'components/_proxied-dot-io/common/io-home-case-studies'
import IoHomeCallToAction from 'components/_proxied-dot-io/common/io-home-call-to-action'
import IoHomePreFooter from 'components/_proxied-dot-io/common/io-home-pre-footer'
import homepageQuery from './home/query.graphql'
import s from './home/home.module.css'
import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'

export default function Homepage({ data }): React.ReactElement {
	const {
		seo,
		heroHeading,
		heroDescription,
		heroCtas,
		heroCards,
		introHeading,
		introDescription,
		introOfferingsImage,
		introOfferings,
		introFeatures,
		introVideo,
		inPracticeHeading,
		inPracticeDescription,
		inPracticeCards,
		inPracticeCtaHeading,
		inPracticeCtaDescription,
		inPracticeCtaLink,
		inPracticeCtaImage,
		useCasesHeading,
		useCasesDescription,
		useCasesCards,
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
				pattern="/boundary-public/img/home-hero-pattern.svg"
				brand="boundary"
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
				brand="boundary"
				heading={introHeading}
				description={introDescription}
				offerings={{
					image: {
						src: introOfferingsImage.url,
						width: introOfferingsImage.width,
						height: introOfferingsImage.height,
						alt: introOfferingsImage.alt,
					},
					list: introOfferings,
				}}
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

			<section className={s.useCases}>
				<div className={s.container}>
					<IoCardContainer
						heading={useCasesHeading}
						description={useCasesDescription}
						cardsPerRow={4}
						cards={useCasesCards.map((card) => {
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
				</div>
			</section>

			<IoHomeInPractice
				brand="boundary"
				pattern="/boundary-public/img/practice-pattern.svg"
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
				cta={{
					heading: inPracticeCtaHeading,
					description: inPracticeCtaDescription,
					link: inPracticeCtaLink,
					image: inPracticeCtaImage,
				}}
			/>

			{caseStudiesFeatured.length === 2 && caseStudiesLinks.length > 0 ? (
				<IoHomeCaseStudies
					heading={caseStudiesHeading}
					description={caseStudiesDescription}
					primary={caseStudiesFeatured}
					secondary={caseStudiesLinks}
				/>
			) : null}

			<IoHomeCallToAction
				brand="boundary"
				heading={callToActionHeading}
				content={callToActionDescription}
				links={callToActionCtas}
			/>

			<IoHomePreFooter
				brand="boundary"
				heading={preFooterHeading}
				description={preFooterDescription}
				ctas={preFooterCtas}
			/>
		</>
	)
}
Homepage.layout = BoundaryIoLayout

export async function getStaticProps() {
	const query = proxiedRivetClient('boundary')
	const { boundaryHomepage } = await query({
		query: homepageQuery,
	})

	return {
		props: {
			data: boundaryHomepage,
		},
		revalidate:
			process.env.HASHI_ENV === 'production'
				? process.env.GLOBAL_REVALIDATE
				: 10,
	}
}

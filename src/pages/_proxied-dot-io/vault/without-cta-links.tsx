import * as React from 'react'
import Head from 'next/head'
import { proxiedRivetClient } from 'lib/cms'
import { abTestTrack } from 'lib/ab-test-track'
import homepageQuery from './home/query.graphql'
import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import { renderMetaTags } from '@hashicorp/react-head'
import IoHomeHero from 'components/_proxied-dot-io/common/io-home-hero'
import IoHomeIntro from 'components/_proxied-dot-io/common/io-home-intro'
import IoHomeInPractice from 'components/_proxied-dot-io/common/io-home-in-practice'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoHomeCaseStudies from 'components/_proxied-dot-io/common/io-home-case-studies'
import IoHomeCallToAction from 'components/_proxied-dot-io/common/io-home-call-to-action'
import IoHomePreFooter from 'components/_proxied-dot-io/common/io-home-pre-footer'
import s from './home/style.module.css'

export default function Homepage({ data }): React.ReactElement {
	const {
		seo,
		heroHeading,
		heroDescription,
		heroCards,
		introHeading,
		introDescription,
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

	React.useEffect(() => {
		abTestTrack({
			type: 'Served',
			test_name: 'CRO Vault CTA links 2022-10',
			variant: 'true',
		})
	}, [])

	return (
		<>
			<Head>{renderMetaTags(seo)}</Head>

			<IoHomeHero
				pattern="/vault-public/img/home-hero-pattern.svg"
				brand="vault"
				heading={heroHeading}
				description={heroDescription}
				ctas={[]}
				cards={heroCards.map((card) => {
					return {
						...card,
						cta: card.cta[0],
					}
				})}
			/>

			<IoHomeIntro
				brand="vault"
				heading={introHeading}
				description={introDescription}
				features={introFeatures}
				video={{
					youtubeId: _introVideo.youtubeId,
					thumbnail: _introVideo.thumbnail.url,
					heading: _introVideo.heading,
					description: _introVideo.description,
					person: {
						name: _introVideo.personName,
						description: _introVideo.personDescription,
						avatar: _introVideo.personAvatar?.url,
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
				brand="vault"
				pattern="/vault-public/img/practice-pattern.svg"
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

			<IoHomeCaseStudies
				heading={caseStudiesHeading}
				description={caseStudiesDescription}
				primary={caseStudiesFeatured}
				secondary={caseStudiesLinks}
			/>

			<IoHomeCallToAction
				brand="vault"
				heading={callToActionHeading}
				content={callToActionDescription}
				links={callToActionCtas}
			/>

			<IoHomePreFooter
				brand="vault"
				heading={preFooterHeading}
				description={preFooterDescription}
				ctas={preFooterCtas}
			/>
		</>
	)
}
Homepage.layout = VaultIoLayout

export async function getStaticProps() {
	const query = proxiedRivetClient('vault')
	const { vaultHomepage } = await query({
		query: homepageQuery,
	})

	return {
		props: {
			data: vaultHomepage,
		},
		revalidate: __config.io_sites.revalidate,
	}
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import * as React from 'react'
import classNames from 'classnames'
import Head from 'next/head'
import { proxiedRivetClient } from 'lib/cms'
import { useFlagBag } from 'flags/client'
import homepageQuery from './home/query.graphql'
import { abTestTrack } from 'lib/ab-test-track'
import { isInUS } from '@hashicorp/platform-util/geo'
import { renderMetaTags } from '@hashicorp/react-head'
import Button from '@hashicorp/react-button'
import StandaloneLink from '@hashicorp/react-standalone-link'
import IoHomeHeroAlt from 'components/_proxied-dot-io/common/io-home-hero-alt'
import IoHomeIntro from 'components/_proxied-dot-io/common/io-home-intro'
import IoHomeInPractice from 'components/_proxied-dot-io/common/io-home-in-practice'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoHomeCaseStudies from 'components/_proxied-dot-io/common/io-home-case-studies'
import IoHomeCallToAction from 'components/_proxied-dot-io/common/io-home-call-to-action'
import IoHomePreFooter from 'components/_proxied-dot-io/common/io-home-pre-footer'
import s from './home/style.module.css'

function Homepage({ data }): React.ReactElement {
	const {
		seo,
		heroHeading,
		heroDescription,
		heroCtas,
		introHeading,
		introDescription,
		introOfferingsImage,
		introOfferings,
		introOfferingsCta,
		introCallout,
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
		useCases,
		tutorialsHeading,
		tutorialCards,
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
	const _introCallout = introCallout[0]
	const _introVideo = introVideo[0]
	const flagBag = useFlagBag()
	const renderVariant = React.useMemo(() => {
		return isInUS() && flagBag.settled && flagBag.flags?.tryForFree
	}, [flagBag])

	return (
		<>
			<Head>{renderMetaTags(seo)}</Head>

			<IoHomeHeroAlt
				brand="consul"
				patterns={{
					start: '/consul-public/img/hero-pattern-start.svg',
					end: '/consul-public/img/hero-pattern-end.svg',
				}}
				heading={heroHeading}
				description={heroDescription}
				// ctas={heroCtas.map((cta) => {
				// 	return {
				// 		title: cta.title,
				// 		href: cta.link,
				// 	}
				// })}
			>
				{heroCtas.map((cta, index) => {
					if (index === 0) {
						return (
							<Button
								key={cta.link}
								title={renderVariant ? 'Try for free' : 'Try HCP Consul'}
								url={cta.link}
								theme={{ brand: 'consul' }}
								onClick={() => {
									abTestTrack({
										type: 'Result',
										test_name: 'io-site primary CTA copy test 03-23',
										variant: flagBag.flags?.tryForFree.toString(),
									})
								}}
								className={classNames(
									s.heroActionsPrimary,
									flagBag.settled && s.settled
								)}
							/>
						)
					}

					return (
						<StandaloneLink key={cta.link} href={cta.link} theme="secondary">
							{cta.title}
						</StandaloneLink>
					)
				})}
			</IoHomeHeroAlt>

			<IoHomeIntro
				brand="consul"
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
					cta: introOfferingsCta[0],
				}}
				callout={
					_introCallout
						? {
								link: _introCallout.link,
								heading: _introCallout.heading,
								description: _introCallout.description,
								cta: _introCallout.cta || 'Learn more',
								thumbnail: {
									src: _introCallout.thumbnail.url,
									width: _introCallout.thumbnail.width,
									height: _introCallout.thumbnail.height,
									alt: _introCallout.thumbnail.alt,
								},
						  }
						: null
				}
				video={
					_introVideo
						? {
								youtubeId: _introVideo.youtubeId,
								thumbnail: _introVideo.thumbnail.url,
								heading: _introVideo.heading,
								description: _introVideo.description,
								person: {
									name: _introVideo.personName,
									description: _introVideo.personDescription,
									avatar: _introVideo.personAvatar?.url,
								},
						  }
						: null
				}
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
									heading: usecase.shortHeading || usecase.heroHeading,
									description:
										usecase.shortDescription || usecase.heroDescription,
								}
							})}
						/>
					</div>
				</section>
			) : null}

			<section className={s.tutorials}>
				<div className={s.container}>
					<IoCardContainer
						heading={tutorialsHeading}
						cardsPerRow={3}
						cards={tutorialCards.map((card) => {
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
				brand="consul"
				pattern="/consul-public/img/practice-pattern.svg"
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
				brand="consul"
				heading={callToActionHeading}
				content={callToActionDescription}
				links={callToActionCtas}
			/>

			<IoHomePreFooter
				brand="consul"
				heading={preFooterHeading}
				description={preFooterDescription}
				ctas={preFooterCtas}
			/>
		</>
	)
}

export async function getStaticProps() {
	const query = proxiedRivetClient('consul')
	const { consulHomepage } = await query({
		query: homepageQuery,
	})

	return {
		props: { data: consulHomepage },
		revalidate: __config.io_sites.revalidate,
	}
}

Homepage.layout = ConsulIoLayout
export default Homepage

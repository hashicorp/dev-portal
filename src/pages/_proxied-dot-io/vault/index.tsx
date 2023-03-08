/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as React from 'react'
import Head from 'next/head'
import classNames from 'classnames'
import { proxiedRivetClient } from 'lib/cms'
import { useFlagBag } from 'flags/client'
import homepageQuery from './home/query.graphql'
import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import { isInUS } from '@hashicorp/platform-util/geo'
import { renderMetaTags } from '@hashicorp/react-head'
import Button from '@hashicorp/react-button'
import StandaloneLink from '@hashicorp/react-standalone-link'
import { abTestTrack } from 'lib/ab-test-track'
import IoHomeHeroAlt from 'components/_proxied-dot-io/common/io-home-hero-alt'
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
		heroCtas,
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
	const flagBag = useFlagBag()
	const renderVariant = React.useMemo(() => {
		return isInUS() && flagBag.settled && flagBag.flags?.tryForFree
	}, [flagBag])

	return (
		<>
			<Head>{renderMetaTags(seo)}</Head>

			<IoHomeHeroAlt
				brand="vault"
				patterns={{
					start: '/vault-public/img/hero-pattern-start.svg',
					end: '/vault-public/img/hero-pattern-end.svg',
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
							<div
								key={cta.link}
								className={classNames(
									s.heroActionsPrimary,
									flagBag.settled && s.settled
								)}
							>
								<Button
									title="Try HCP Vault"
									url={cta.link}
									theme={{ brand: 'vault' }}
									aria-hidden={renderVariant ? 'true' : undefined}
									tabindex={renderVariant ? '-1' : undefined}
									onClick={() => {
										abTestTrack({
											type: 'Result',
											test_name: 'io-site primary CTA copy test 03-23',
											variant: 'false',
										})
									}}
								/>

								<Button
									title="Try for free"
									url={cta.link}
									theme={{ brand: 'vault' }}
									aria-hidden={renderVariant ? undefined : 'true'}
									tabindex={renderVariant ? undefined : '-1'}
									onClick={() => {
										abTestTrack({
											type: 'Result',
											test_name: 'io-site primary CTA copy test 03-23',
											variant: 'true',
										})
									}}
								/>
							</div>
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

import * as React from 'react'
import Head from 'next/head'
import { proxiedRivetClient } from 'lib/cms'
import useCasesQuery from './query.graphql'
import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import { renderMetaTags } from '@hashicorp/react-head'
import IoUsecaseHero from 'components/_proxied-dot-io/common/io-usecase-hero'
import IoUsecaseSection from 'components/_proxied-dot-io/common/io-usecase-section'
import IoUsecaseCustomer from 'components/_proxied-dot-io/common/io-usecase-customer'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoVideoCallout from 'components/_proxied-dot-io/common/io-video-callout'
import IoUsecaseCallToAction from 'components/_proxied-dot-io/common/io-usecase-call-to-action'
import s from './style.module.css'

export default function UseCasePage({ data }: $TSFixMe) {
  const {
    seo,
    heroHeading,
    heroDescription,
    challengeHeading,
    challengeDescription,
    challengeImage,
    challengeLink,
    solutionHeading,
    solutionDescription,
    solutionImage,
    solutionLink,
    customerCaseStudy,
    cardsHeading,
    cardsDescription,
    tutorialsLink,
    tutorialCards,
    documentationLink,
    documentationCards,
    callToActionHeading,
    callToActionDescription,
    callToActionLinks,
    videoCallout,
  } = data
  const _customerCaseStudy = customerCaseStudy[0]
  const _videoCallout = videoCallout[0]

  return (
    <>
      <Head>{renderMetaTags(seo)}</Head>

      <IoUsecaseHero
        eyebrow="Use case"
        heading={heroHeading}
        description={heroDescription}
        pattern="/vault/img/usecase-hero-pattern.svg"
      />

      <IoUsecaseSection
        brand="vault"
        eyebrow="Challenge"
        heading={challengeHeading}
        description={challengeDescription}
        media={{
          src: challengeImage?.url,
          width: challengeImage?.width,
          height: challengeImage?.height,
          alt: challengeImage?.alt,
        }}
        cta={{
          text: 'Learn more',
          link: challengeLink,
        }}
      />

      <IoUsecaseSection
        brand="vault"
        bottomIsFlush={_customerCaseStudy}
        eyebrow="Solution"
        heading={solutionHeading}
        description={solutionDescription}
        media={{
          src: solutionImage?.url,
          width: solutionImage?.width,
          height: solutionImage?.height,
          alt: solutionImage?.alt,
        }}
        cta={{
          text: 'Learn more',
          link: solutionLink,
        }}
      />

      {_customerCaseStudy ? (
        <IoUsecaseCustomer
          link={_customerCaseStudy.link}
          media={{
            src: _customerCaseStudy.image.url,
            width: _customerCaseStudy.image.width,
            height: _customerCaseStudy.image.height,
            alt: _customerCaseStudy.image.alt,
          }}
          logo={{
            src: _customerCaseStudy.logo.url,
            width: _customerCaseStudy.logo.width,
            height: _customerCaseStudy.logo.height,
            alt: _customerCaseStudy.logo.alt,
          }}
          heading={_customerCaseStudy.heading}
          description={_customerCaseStudy.description}
          stats={_customerCaseStudy.stats.map((stat: $TSFixMe) => {
            return {
              value: stat.value,
              key: stat.label,
            }
          })}
        />
      ) : null}

      <div className={s.cards}>
        <IoCardContainer
          heading={cardsHeading}
          description={cardsDescription}
          label="Docs"
          cta={{
            url: documentationLink ? documentationLink : '/docs',
            text: 'Explore all',
          }}
          cardsPerRow={3}
          cards={documentationCards.map((card: $TSFixMe) => {
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

        <IoCardContainer
          label="Tutorials"
          cta={{
            url: tutorialsLink
              ? tutorialsLink
              : 'https://learn.hashicorp.com/vault',
            text: 'Explore all',
          }}
          cardsPerRow={3}
          cards={tutorialCards.map((card: $TSFixMe) => {
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

      <div className={s.callToAction}>
        <IoUsecaseCallToAction
          theme="light"
          brand="vault"
          heading={callToActionHeading}
          description={callToActionDescription}
          links={callToActionLinks.map((link: $TSFixMe) => {
            return {
              text: link.title,
              url: link.link,
            }
          })}
          pattern="/vault/img/usecase-callout-pattern.svg"
        />
      </div>

      {_videoCallout ? (
        <div className={s.videoCallout}>
          <IoVideoCallout
            youtubeId={_videoCallout.youtubeId}
            thumbnail={_videoCallout.thumbnail.url}
            heading={_videoCallout.heading}
            description={_videoCallout.description}
            person={{
              avatar: _videoCallout.personAvatar?.url,
              name: _videoCallout.personName,
              description: _videoCallout.personDescription,
            }}
          />
        </div>
      ) : null}
    </>
  )
}
UseCasePage.layout = VaultIoLayout

export async function getStaticPaths() {
  const query = proxiedRivetClient('vault')
  const { allVaultUseCases } = await query({
    query: useCasesQuery,
  })

  return {
    paths: allVaultUseCases.map((page: $TSFixMe) => {
      return {
        params: {
          slug: page.slug,
        },
      }
    }),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params, ...ctx }: $TSFixMe) {
  const { slug } = params

  const query = proxiedRivetClient('vault')
  const { allVaultUseCases } = await query({
    query: useCasesQuery,
  })

  const page = allVaultUseCases.find((page: $TSFixMe) => page.slug === slug)

  if (!page) {
    return { notFound: true }
  }

  return {
    props: {
      data: page,
    },
    revalidate: __config.io_sites.revalidate,
  }
}

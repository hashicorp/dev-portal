import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import InlineLinkButton from 'components/inline-link-button'
import CardsGridList from 'components/cards-grid-list'
import IconCardLink, { IconCardLinkProps } from 'components/icon-card-link'
import {
  ErrorViewContainer,
  ErrorViewH1,
  ErrorViewParagraph,
} from '../components'

import s from './dev-dot-404.module.css'

/**
 * Generic 404 error view content for use in dev-dot.
 */
export function DevDot404(): ReactElement {
  const router = useRouter()
  useErrorPageAnalytics(404)

  return (
    <ErrorViewContainer>
      <ErrorViewH1>
        We couldn&apos;t find the page you&apos;re looking&nbsp;for.
      </ErrorViewH1>
      <ErrorViewParagraph>
        Please check the url you entered for typos,{' '}
        <InlineLinkButton onClick={router.back}>go back</InlineLinkButton> to
        the page you came from, or go to one of the pages below.
      </ErrorViewParagraph>
      <div className={s.cards}>
        <CardsGridList>
          {[
            {
              url: '/vault',
              text: 'Vault',
              productSlug: 'vault',
              icon: <IconVaultColor16 />,
            },
            {
              url: '/waypoint',
              text: 'Waypoint',
              productSlug: 'waypoint',
              icon: <IconWaypointColor16 />,
            },
            {
              url: '/',
              text: 'HashiCorp Developer',
              productSlug: 'hashicorp',
              icon: <IconHome16 />,
            },
          ].map(
            (
              { icon, text, url, productSlug }: IconCardLinkProps,
              key: number
            ) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={key}>
                  <IconCardLink
                    icon={icon}
                    productSlug={productSlug}
                    text={text}
                    url={url}
                  />
                </li>
              )
            }
          )}
        </CardsGridList>
      </div>
    </ErrorViewContainer>
  )
}

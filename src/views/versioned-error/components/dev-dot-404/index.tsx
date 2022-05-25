import React, { ReactElement } from 'react'
import CardsGridList from 'components/cards-grid-list'
import IconCardLink, { IconCardLinkProps } from 'components/icon-card-link'
// import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
// import use404Redirects from '@hashicorp/react-error-view/use-404-redirects'
// import { ErrorPageProps } from './types'
import s from './dev-dot-404.module.css'

export function DevDot404(): ReactElement {
  return (
    <div className={s.root}>
      <h1 className={s.heading}>
        We couldn&apos;t find the page you&apos;re looking for.
      </h1>
      <p className={s.body}>
        Please check the url you entered for typos, go back to the page you came
        from, or go to one of the pages below.
      </p>
      <div className={s.cards}>
        <CardsGridList>
          {[
            {
              url: '/vault',
              text: 'Vault',
              productSlug: 'vault',
            },
            {
              url: '/waypoint',
              text: 'Waypoint',
              productSlug: 'waypoint',
            },
            {
              url: '/',
              text: 'HashiCorp Developer',
              productSlug: 'hashicorp',
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
    </div>
  )
}

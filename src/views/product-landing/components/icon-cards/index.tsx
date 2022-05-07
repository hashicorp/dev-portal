import CardsGridList from 'components/cards-grid-list'
import { IconCardsProps, IconCard } from './types'
import { getIconCards } from './get-icon-cards'
import s from './icon-cards.module.css'
import CardLink from 'components/card-link'
import { CSSProperties } from 'react'

function IconCards({ cards, productSlug }: IconCardsProps) {
  return (
    <CardsGridList>
      {cards.map(({ icon, text, url }: IconCard, key: number) => {
        // eslint-disable-next-line react/no-array-index-key
        return (
          <LinkedIconCard
            key={key}
            url={url}
            icon={icon}
            text={text}
            productSlug={productSlug}
          />
        )
      })}
    </CardsGridList>
  )
}

function LinkedIconCard({ icon, text, url, productSlug }: IconCard) {
  const colorToken =
    productSlug == 'sentinel' || productSlug == 'hcp'
      ? '--token-color-hashicorp-brand'
      : `--token-color-${productSlug}-brand`
  return (
    <CardLink href={url} className={s.linkedIconCard}>
      <span
        className={s.icon}
        style={{ '--icon-color': `var(${colorToken})` } as CSSProperties}
      >
        {icon}
      </span>
      <span className={s.text}>{text}</span>
    </CardLink>
  )
}

export type { IconCardsProps }
export { getIconCards }
export default IconCards

import CardsGridList from 'components/cards-grid-list'
import IconCardLink from 'components/icon-card-link'
import { IconCardsProps, IconCard } from './types'
import { getIconCards } from './get-icon-cards'

function IconCards({ cards, productSlug }: IconCardsProps) {
  return (
    <CardsGridList>
      {cards.map(({ icon, text, url }: IconCard, key: number) => {
        return (
          <IconCardLink
            // eslint-disable-next-line react/no-array-index-key
            key={key}
            icon={icon}
            productSlug={productSlug}
            text={text}
            url={url}
          />
        )
      })}
    </CardsGridList>
  )
}

export type { IconCardsProps }
export { getIconCards }
export default IconCards

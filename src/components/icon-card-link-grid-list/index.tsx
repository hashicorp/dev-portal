import CardsGridList from 'components/cards-grid-list'
import IconCardLink from 'components/icon-card-link'
import { IconCardLinkGridListProps, IconCard } from './types'

function IconCardLinkGridList({
  cards,
  productSlug,
}: IconCardLinkGridListProps) {
  return (
    <CardsGridList>
      {cards.map(({ icon, text, url }: IconCard, key: number) => {
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
      })}
    </CardsGridList>
  )
}

export type { IconCardLinkGridListProps }
export default IconCardLinkGridList

import { Product as ClientProduct } from 'lib/learn-client/types'
import { TutorialData } from 'views/tutorial-view'
import { renderProductBadges, ProductDisplayOption } from './components/badge'
import { generateBadges } from './helpers'
import s from './badges.module.css'

export interface BadgesProps
  extends Pick<TutorialData, 'readTime' | 'edition'> {
  products: Pick<ClientProduct, 'name' | 'slug'>[]
  isBeta: boolean
  hasVideo: boolean
  isInteractive: boolean
}

export function Badges(props: BadgesProps): React.ReactElement {
  const { readTime, products, edition, isBeta, hasVideo, isInteractive } = props
  const [badgeDisplayOptions, Badge] = generateBadges(
    readTime,
    products,
    edition
  )
  const productBadgeOptions =
    badgeDisplayOptions.products as ProductDisplayOption[]
  const showProductBadges =
    Array.isArray(productBadgeOptions) && productBadgeOptions.length > 0

  return (
    <ul className={s.list}>
      <Badge type="readTime" />
      {isBeta ? <Badge className={s.beta} type="isBeta" /> : null}
      {edition !== 'open_source' ? <Badge type="edition" /> : null}
      {showProductBadges ? renderProductBadges(productBadgeOptions) : null}
      {hasVideo ? <Badge type="hasVideo" /> : null}
      {isInteractive ? <Badge type="isInteractive" /> : null}
    </ul>
  )
}

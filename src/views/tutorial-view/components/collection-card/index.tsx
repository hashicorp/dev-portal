import { getCollectionSlug } from 'views/collection-view/helpers'
import CardLink from 'components/card-link'
import classNames from 'classnames'
import { CollectionCardProps } from './types'
import s from './collection-card.module.css'

/**
 * TODO: styles and functionality dependent on design spec being finalized.
 * (currently "WIP" in Figma)
 * Figma: https://www.figma.com/file/VD7ahvXuXWJApeGnhbW4hv/Dev-Portal?node-id=6860%3A79233
 *
 * TODO: note as well that not all collection links will work, for now.
 * This is because not all product collections are in dev-dot, yet.
 * Asana task to address:
 * https://app.asana.com/0/1201987349274776/1201991101510148
 */
function CollectionCard({
  className,
  slug,
  numTutorials,
  name,
  description,
  theme,
}: CollectionCardProps) {
  return (
    <CardLink
      className={classNames(s.root, className)}
      href={getCollectionSlug(slug)}
    >
      <span>{numTutorials} Tutorials</span>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>{theme} Logo</p>
    </CardLink>
  )
}

export type { CollectionCardProps }
export default CollectionCard

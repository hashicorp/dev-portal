import { CollectionCardsProps } from './types'
import s from './collection-cards.module.css'

function CollectionCards({ collectionCards }: CollectionCardsProps) {
  return (
    <pre className={s.placeholder}>
      <code>
        {JSON.stringify(
          { component: 'CollectionCards', collectionCards },
          null,
          2
        )}
      </code>
    </pre>
  )
}

export type { CollectionCardsProps }
export { CollectionCards }

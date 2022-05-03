import CardsGridList from 'components/cards-grid-list'
import TutorialCard from 'components/tutorial-card'
import { TutorialCardPropsWithId } from 'components/tutorial-card/types'
import { CollectionTutorialListProps } from './types'
import s from './collection-tutorial-list.module.css'

function CollectionTutorialList({
  tutorials,
  isOrdered,
}: CollectionTutorialListProps) {
  return (
    <div className={s.root}>
      <CardsGridList isOrdered={isOrdered}>
        {tutorials.map((tutorial: TutorialCardPropsWithId) => {
          const { id, ...cardProps } = tutorial
          return (
            <li key={tutorial.id}>
              <TutorialCard {...cardProps} />
            </li>
          )
        })}
      </CardsGridList>
    </div>
  )
}

export default CollectionTutorialList

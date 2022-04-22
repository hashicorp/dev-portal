import classNames from 'classnames'
import TutorialCard from 'components/tutorial-card'
import { TutorialCardPropsWithId } from 'components/tutorial-card/types'
import s from './collection-tutorial-list.module.css'

function CollectionTutorialList({
  tutorials,
  isOrdered,
}: {
  tutorials: TutorialCardPropsWithId[]
  isOrdered: boolean
}) {
  const ListRoot = isOrdered ? 'ol' : 'ul'

  return (
    <ListRoot className={classNames(s.listRoot, { [s.isOrdered]: isOrdered })}>
      {tutorials.map((tutorial: TutorialCardPropsWithId) => {
        return (
          <li key={tutorial.id}>
            <TutorialCard
              description={tutorial.description}
              duration={tutorial.duration}
              hasInteractiveLab={tutorial.hasInteractiveLab}
              hasVideo={tutorial.hasVideo}
              heading={tutorial.heading}
              url={tutorial.url}
              productsUsed={tutorial.productsUsed}
            />
          </li>
        )
      })}
    </ListRoot>
  )
}

export default CollectionTutorialList

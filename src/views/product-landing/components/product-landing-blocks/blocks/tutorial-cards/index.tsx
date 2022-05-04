import { TutorialCardsProps } from './types'
import s from './tutorial-cards.module.css'

function TutorialCards({ tutorialSlugs }: TutorialCardsProps) {
  return (
    <pre className={s.placeholder}>
      <code>
        {JSON.stringify({ component: 'TutorialCards', tutorialSlugs }, null, 2)}
      </code>
    </pre>
  )
}

export type { TutorialCardsProps }
export { TutorialCards }

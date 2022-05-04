import { TutorialCardsProps } from './types'
import s from './tutorial-cards.module.css'

function TutorialCards({ tutorialCards }: TutorialCardsProps) {
  return (
    <pre className={s.placeholder}>
      <code>
        {JSON.stringify({ component: 'TutorialCards', tutorialCards }, null, 2)}
      </code>
    </pre>
  )
}

export type { TutorialCardsProps }
export { TutorialCards }

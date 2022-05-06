import { LinkedCardsProps } from './types'
import s from './linked-cards.module.css'

function LinkedCards({ cards }: LinkedCardsProps) {
  return (
    <pre className={s.placeholder}>
      <code>
        {JSON.stringify({ component: 'LinkedCards', cards }, null, 2)}
      </code>
    </pre>
  )
}

export type { LinkedCardsProps }
export { LinkedCards }

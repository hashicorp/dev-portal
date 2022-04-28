import s from './logo-card-list.module.css'
import { LogoCardListProps, LogoCardListItem } from './types'

function LogoCardList({ items }: LogoCardListProps): JSX.Element {
  return (
    <pre className={s.placeholder}>
      <code>
        {JSON.stringify({ component: 'LogoCardList', items }, null, 2)}
      </code>
    </pre>
  )
}

export type { LogoCardListProps, LogoCardListItem }
export { LogoCardList }

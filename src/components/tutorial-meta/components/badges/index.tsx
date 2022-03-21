import { EditionOption, ProductOption } from 'lib/learn-client/types'
import s from './badges.module.css'

export interface BadgesProps {
  readTime: number
  products: ProductOption[]
  isBeta: boolean
  edition: EditionOption
  hasVideo: boolean
  isInteractive: boolean
}

export function Badges({
  readTime,
  products,
  edition,
  isBeta,
  hasVideo,
  isInteractive,
}: BadgesProps): React.ReactElement {
  return (
    <ul className={s.list}>
      <li>{readTime} min</li>
      <li>{products.join(', ')}</li>
      <li>{edition}</li>
      {isBeta ? <li>Beta </li> : null}
      {hasVideo ? <li>Video</li> : null}
      {isInteractive ? <li>Interactive</li> : null}
    </ul>
  )
}

import classNames from 'classnames'
import { IconClock16 } from '@hashicorp/flight-icons/svg-react/clock-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { EditionOption, Product as ClientProduct } from 'lib/learn-client/types'
import s from './badges.module.css'

export interface BadgesProps {
  readTime: number
  products: Pick<ClientProduct, 'name' | 'slug'>[]
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
      <li className={s.badgeItem}>
        <IconClock16 className={s.icon} />
        <span>{readTime} min</span>
      </li>
      <li className={classNames(s.badgeItem, s.beta)}>Beta </li>
      <li className={s.badgeItem}>{edition}</li>
      <li className={s.badgeItem}>{products[0].name}</li>
      <li className={s.badgeItem}>
        <IconPlay16 className={s.icon} />
        <span>Video</span>
      </li>
      <li className={s.badgeItem}>
        <IconTerminalScreen16 className={s.icon} />
        <span>Interactive</span>
      </li>

      {/* 
      {edition !== 'open_source' ?  <li className={s.badgeItem}>{edition}</li> :null}
      {isBeta ? (
        <li className={classNames(s.badgeItem, s.beta)}>Beta </li>
      ) : null}
      {hasVideo ? <li className={s.badgeItem}>Video</li> : null}
      {isInteractive ? <li className={s.badgeItem}>Interactive</li> : null} */}
    </ul>
  )
}

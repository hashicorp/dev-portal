import { CSSProperties, ReactElement } from 'react'
import { FlexFloatProps } from './types'
import s from './style.module.css'

/**
 * Renders child items in a float-like arrangement using display: flex,
 * with a clean interface for controlling the gap between items.
 */
function FlexFloat({ children, gap }: FlexFloatProps): ReactElement {
  return (
    <div
      className={s.root}
      style={{ '--item-spacing': `${gap}px` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default FlexFloat

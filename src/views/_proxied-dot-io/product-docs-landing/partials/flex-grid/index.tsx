import { CSSProperties, ReactElement, ReactNode } from 'react'
import s from './style.module.css'

function FlexGrid({
  children,
  gap,
}: {
  children: ReactNode
  /* The gap to leave between items, in pixels */
  gap: number
}): ReactElement {
  return (
    <div
      className={s.root}
      style={{ '--item-spacing': `${gap}px` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default FlexGrid

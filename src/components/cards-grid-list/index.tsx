import { ReactNode, Children } from 'react'
import classNames from 'classnames'
import s from './cards-grid-list.module.css'

/**
 * Displays cards in a grid. Intended for use in main content areas.
 *
 * The layout for this component is driven by minimum width settings
 * on card children, rather than by explicit column counts.
 *
 * The layout approach is intended to reduce brittleness, and to help ensure
 * that we never shrink cards below their desired minimum width.
 * It also opens the possibility of using this component
 * outside of our main content area, if desired.
 */
function CardsGridList({
  children,
  isOrdered = false,
}: {
  children: ReactNode
  isOrdered?: boolean
}) {
  const ListRoot = isOrdered ? 'ol' : 'ul'
  const allowThreeColumns = !isOrdered && Children.count(children) % 3 == 0

  return (
    <ListRoot
      className={classNames(s.listRoot, {
        [s.isOrdered]: isOrdered,
        [s.allowThreeColumns]: allowThreeColumns,
      })}
    >
      {children}
    </ListRoot>
  )
}

export default CardsGridList

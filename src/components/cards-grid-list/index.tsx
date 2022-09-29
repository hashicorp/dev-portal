import { Children, CSSProperties } from 'react'
import classNames from 'classnames'
import { CardsGridListProps } from './types'
import { TutorialCardsGridList, TutorialCardsGridListProps } from './components'
import s from './cards-grid-list.module.css'

/**
 * Displays cards in a grid. Intended for use in main content areas.
 *
 * This component has two layout modes.
 *
 * DEFAULT - MIN WIDTH MODE
 *
 * The default is "min-width" mode. In this mode, the layout for the component
 * driven by minimum width settings on card children, rather than by explicit column counts.
 *
 * The layout approach is intended to reduce brittleness, and to help ensure
 * that we never shrink cards below their desired minimum width.
 * It also opens the possibility of using this component
 * outside of our main content area, if desired.
 *
 * FIXED COLUMN LAYOUT
 *
 * In this mode, the layout for the component is based on fixed column counts.
 * Passing an integer 1-3 to the `fixedColumnLayout` prop will use this mode,
 * and will set the maximum column count on large viewports. Note that
 * the media-queries used to change the column count are fixed. This makes
 * fixed column mode slightly more brittle than min-width mode.
 */
function CardsGridList({
	children,
	isOrdered = false,
	fixedColumns,
	gridGap = '24px',
}: CardsGridListProps) {
	const ListRoot = isOrdered ? 'ol' : 'ul'

	/**
	 * For minimum width mode, where layout is driven by
	 * minimum card widths, with column count automatically calculated.
	 */
	const minWidthClasses = classNames(s.minWidthMode, {
		[s.allowThreeColumns]: Children.count(children) % 3 == 0,
	})

	/**
	 * For fixed columns mode, where layout is driven by
	 * media queries and explicit column counts.
	 */
	const fixedModeClasses = classNames(
		s.fixedColumnsMode,
		s[`columns${fixedColumns}`]
	)

	return (
		<ListRoot
			className={classNames(
				s.listRoot,
				fixedColumns ? fixedModeClasses : minWidthClasses
			)}
			style={
				{
					'--grid-gap': gridGap,
				} as CSSProperties
			}
		>
			{children}
		</ListRoot>
	)
}

export type { CardsGridListProps, TutorialCardsGridListProps }
export { TutorialCardsGridList }
export default CardsGridList

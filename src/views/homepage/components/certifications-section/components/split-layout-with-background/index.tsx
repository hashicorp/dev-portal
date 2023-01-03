import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './split-layout-with-background.module.css'

/**
 * Render a split layout with a background.
 */
export function SplitLayoutWithBackground({
	paddingClass,
	backgroundClass,
	startSlot,
	endSlot,
}: {
	/**
	 * Optional class to add to the root element. Intended for vertical padding.
	 */
	paddingClass?: string
	/**
	 * Optional background class. Intended for adding a background behind
	 * the split layout.
	 */
	backgroundClass?: string
	/**
	 * Contents to render in the start slot of the split layout.
	 */
	startSlot: ReactNode
	/**
	 * Contents to render in the end slot of the split layout.
	 */
	endSlot: ReactNode
}) {
	return (
		<div className={classNames(s.root, paddingClass)}>
			<div className={classNames(s.backgroundBase, backgroundClass)} />
			<div className={s.startEndLayout}>
				<div className={s.startSlot}>{startSlot}</div>
				<div className={s.endSlot}>{endSlot}</div>
			</div>
		</div>
	)
}

import classNames from 'classnames'
import { SplitLayoutWithBackgroundProps } from './types'
import s from './split-layout-with-background.module.css'

/**
 * Render a split layout with a background.
 *
 * Note: the start slot and end slot dimensions may not meet all needs.
 * They were implemented for /certifications initially.
 * The start slot is intended to be used with text content, and
 * the end slot is intended to be used with presentational image content.
 */
export function SplitLayoutWithBackground({
	paddingClass,
	backgroundClass,
	startSlot,
	endSlot,
}: SplitLayoutWithBackgroundProps) {
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

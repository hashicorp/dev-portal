import { CSSProperties } from 'react'
import s from './progress-bar.module.css'

/**
 * Displays a bar that fills to the percent provided
 * through the `percentDone` prop.
 *
 * `ProgressBar` is always `4px` tall, and grows to fill the width of its
 * parent container. It also accepts an optional `rounded` boolean prop,
 * which defaults to `true`. If `rounded` is set to `false`, the ends of
 * the progress bar will end in sharp corners.
 */
function ProgressBar({
	percentDone,
	rounded = true,
}: {
	percentDone: number
	rounded?: boolean
}) {
	return (
		<span
			className={s.root}
			style={
				{
					'--border-radius': rounded ? '2px' : '0px',
					'--percent-done': `${percentDone}%`,
				} as CSSProperties
			}
		>
			<span className={s.indicator} />
		</span>
	)
}

export default ProgressBar

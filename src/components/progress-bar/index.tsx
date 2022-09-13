import { CSSProperties } from 'react'
import s from './progress-bar.module.css'

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

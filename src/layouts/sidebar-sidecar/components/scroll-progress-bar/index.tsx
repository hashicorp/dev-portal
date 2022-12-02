import { useEffect, useState } from 'react'
import { m, MotionValue } from 'framer-motion'
import classNames from 'classnames'
import s from './scroll-progress-bar.module.css'

/**
 * Displays a scroll progress bar at the bottom of SidebarSidecarLayout.
 */
function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
	const [isComplete, setIsComplete] = useState<boolean>(false)

	useEffect(
		() =>
			progress.onChange((latest) => {
				const newIsComplete = Math.round(latest * 1000) === 1000
				if (isComplete !== newIsComplete) {
					setIsComplete(newIsComplete)
				}
			}),
		[isComplete, progress]
	)

	return (
		<div className={classNames(s.root, { [s.isComplete]: isComplete })}>
			<m.div className={s.progress} style={{ scaleX: progress }} />
		</div>
	)
}

export { ScrollProgressBar }

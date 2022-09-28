// import ProgressBar from 'components/progress-bar'
import { m, MotionValue } from 'framer-motion'
import s from './scroll-progress-bar.module.css'

/**
 * Displays a scroll progress bar at the bottom of SidebarSidecarLayout.
 */
function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
	return (
		<div className={s.root}>
			{/* <ProgressBar percentDone={progress * 100} rounded={false} /> */}
			<m.div className={s.progress} style={{ scaleX: progress }} />
		</div>
	)
}

export { ScrollProgressBar }

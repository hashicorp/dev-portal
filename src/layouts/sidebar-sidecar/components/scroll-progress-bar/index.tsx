import ProgressBar from 'components/progress-bar'
import s from './scroll-progress-bar.module.css'

/**
 * Displays a scroll progress bar at the bottom of SidebarSidecarLayout.
 */
function ScrollProgressBar({ progress }: { progress: number }) {
	return (
		<div className={s.root}>
			<ProgressBar percentDone={progress * 100} rounded={false} />
		</div>
	)
}

export { ScrollProgressBar }

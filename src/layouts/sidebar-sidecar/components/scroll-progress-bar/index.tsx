import ProgressBar from 'components/progress-bar'
import useScrollPercentage from 'hooks/use-scroll-percentage'
import s from './scroll-progress-bar.module.css'

function ScrollProgressBar() {
	const rawPercent = useScrollPercentage({
		mutationTargetSelector: '#main',
		excludeViewportHeight: true,
	})
	const percentScrolled = typeof rawPercent !== 'number' ? 0 : rawPercent

	return (
		<div className={s.root}>
			<ProgressBar percentDone={percentScrolled} rounded={false} />
		</div>
	)
}

export { ScrollProgressBar }

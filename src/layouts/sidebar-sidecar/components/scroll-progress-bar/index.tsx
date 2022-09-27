import ProgressBar from 'components/progress-bar'
import useScrollPercentage from 'hooks/use-scroll-percentage'
import s from './scroll-progress-bar.module.css'

function ScrollProgressBar() {
	const rawScrollPercent = useScrollPercentage()
	const scrollPercent = rawScrollPercent == null ? 0 : rawScrollPercent

	return (
		<div className={s.root}>
			<pre className={s.devPre}>
				<code>
					{scrollPercent.toFixed(2)}% scrolled. TODO: Implement scroll progress
					functionality TODO:&nbsp;polish&nbsp;styles
				</code>
			</pre>
			<ProgressBar percentDone={scrollPercent} rounded={false} />
		</div>
	)
}

export { ScrollProgressBar }

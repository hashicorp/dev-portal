import ProgressBar from 'components/progress-bar'
import useScrollPercentage from 'hooks/use-scroll-percentage'
import s from './scroll-progress-bar.module.css'

function ScrollProgressBar() {
	const {
		percentageScrolled: rawScrollPercent,
		documentScrollHeight,
		windowHeight,
	} = useScrollPercentage('#main')
	const scrollPercent =
		typeof rawScrollPercent != 'number' ? 0 : rawScrollPercent

	return (
		<div className={s.root}>
			<pre className={s.devPre}>
				<code>
					{scrollPercent.toFixed(2)}% scrolled.
					<br />
					documentScrollHeight: {documentScrollHeight}
					<br />
					windowHeight: {windowHeight}
				</code>
			</pre>
			<ProgressBar percentDone={scrollPercent} rounded={false} />
		</div>
	)
}

export { ScrollProgressBar }

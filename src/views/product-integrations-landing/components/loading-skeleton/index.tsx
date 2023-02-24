import s from './integrations-loading-skeleton.module.css'

/**
 * @TODO replace with a more standard system when it's ready.
 * https://app.asana.com/0/1202097197789424/1202791375540720/f
 */
const LoadingSkeleton = () => {
	return (
		<div className={s.root}>
			<div className={s.filterInput} />
			<div className="g-hide-on-mobile">
				<div className={s.filterControlsRow} />
				<div className={s.tagsRow} />
			</div>
			<div className="g-hide-on-tablet g-hide-on-desktop">
				<div className={s.filtersButton} />
				<div className={s.tagsRow} />
				<div className={s.resultsCountRow} />
			</div>
			<div className={s.cardsGrid}>
				{[1, 2, 3, 4].map((_, index) => (
					<div className={s.card} key={index} />
				))}
			</div>
		</div>
	)
}

export default LoadingSkeleton

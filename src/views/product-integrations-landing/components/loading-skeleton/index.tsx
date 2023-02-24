import classNames from 'classnames'
import s from './integrations-loading-skeleton.module.css'

const FiltersRow = () => {
	return (
		<div className={s.filtersRow}>
			{[1, 2, 3, 4, 5].map((_, index) => (
				<div className={s.tag} key={index} />
			))}
			<div className={classNames('g-hide-on-mobile', s.clearFiltersButton)} />
		</div>
	)
}

const WideViewportContent = () => {
	return (
		<div className="g-hide-on-mobile">
			<div className={s.filterControls}>
				<div className={s.multiSelectsGroup}>
					<div className={s.multiSelect} />
					<div className={s.multiSelect} />
					<div className={s.multiSelect} />
				</div>
				<div className={s.resultsText} />
			</div>
			<FiltersRow />
		</div>
	)
}

const NarrowViewportContent = () => {
	return (
		<div className="g-hide-on-tablet g-hide-on-desktop">
			<div className={s.mobileFiltersButton} />
			<FiltersRow />
			<div className={s.resultsText} />
		</div>
	)
}

/**
 * @TODO replace with a more standard system when it's ready.
 * https://app.asana.com/0/1202097197789424/1202791375540720/f
 */
const LoadingSkeleton = () => {
	return (
		<div className={s.root}>
			<div className={s.filterInput} />
			<NarrowViewportContent />
			<WideViewportContent />
			<div className={s.cardsGrid}>
				{[1, 2, 3, 4].map((_, index) => (
					<div className={s.card} key={index} />
				))}
			</div>
		</div>
	)
}

export default LoadingSkeleton

import s from './tab-heading-with-count.module.css'

/**
 * Display heading text alongside an optional count badge.
 *
 * Note: could consider `<Badge />` here, but designs differ slightly,
 * with more rounding, so have styled independently of `<Badge />` for now.
 */
function TabHeadingWithCount({
	heading,
	count,
}: {
	heading: string
	count?: number
}) {
	return (
		<span className={s.root}>
			{heading}
			{typeof count === 'number' ? (
				<span className={s.countBadge}>{String(count)}</span>
			) : null}
		</span>
	)
}

export default TabHeadingWithCount

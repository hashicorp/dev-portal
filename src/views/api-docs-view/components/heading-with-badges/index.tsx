import Badge from 'components/badge'
import s from './heading-with-badges.module.css'

/**
 * Render a heading with an optional badge.
 *
 * Note: we accept `elem` and allow rendering of the heading as a `<p />`
 * because there's an `h1` later on the page, used for the service name.
 * We should likely fix this up in a future iteration of API page work.
 */
function HeadingWithBadges({
	text,
	badges,
	elem,
}: {
	text: string
	badges?: string[]
	elem: 'p' | 'h1'
}) {
	const Elem = elem
	return (
		<Elem className={s.root}>
			{text}
			{badges.length
				? badges.map((badge: string) => {
						return (
							<span key={badge} className={s.badgeContainer}>
								<Badge text={badge} type="outlined" />
							</span>
						)
				  })
				: null}
		</Elem>
	)
}

export { HeadingWithBadges }

import Badge, { BadgeProps } from 'components/badge'
import s from './heading-with-badges.module.css'

export interface HeadingWithBadgesProps {
	text: string
	badges?: (string | { text: string; type: BadgeProps['type'] })[]
	elem: 'p' | 'h1'
}
/**
 * Render a heading with an optional badge.
 *
 * Note: we accept `elem` and allow rendering of the heading as a `<p />`
 * because there's an `h1` later on the page, used for the service name.
 * We should likely fix this up in a future iteration of API page work.
 */
function HeadingWithBadges({ text, badges, elem }: HeadingWithBadgesProps) {
	const Elem = elem
	return (
		<Elem className={s.root}>
			{text}
			{badges.length
				? badges
						.map((badge): { text: string; type: BadgeProps['type'] } => {
							return typeof badge === 'string'
								? { text: badge, type: 'outlined' }
								: badge
						})
						.map(({ text, type }) => {
							return (
								<span key={text} className={s.badgeContainer}>
									<Badge text={text} type={type} />
								</span>
							)
						})
				: null}
		</Elem>
	)
}

export { HeadingWithBadges }

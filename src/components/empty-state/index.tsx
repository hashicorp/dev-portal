import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import Text from 'components/text'
import s from './empty-state.module.css'
import { EmptyStateProps } from './types'

export type { EmptyStateProps }

/**
 * Render an empty state, generally when in a dynamic list setting where
 * there is a possibility of no results.
 */
export default function EmptyState({
	icon,
	heading,
	subheading,
	callToAction,
}: EmptyStateProps) {
	return (
		<div className={s.wrapper}>
			{icon ? <IconTile size="small">{icon}</IconTile> : null}
			<Heading level={2} size={300} weight="semibold" className={s.heading}>
				{heading}
			</Heading>
			<Text className={s.subheading}>{subheading}</Text>
			{callToAction ? (
				<div className={s.callToAction}>{callToAction}</div>
			) : null}
		</div>
	)
}

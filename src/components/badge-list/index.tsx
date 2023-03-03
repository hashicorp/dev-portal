import classNames from 'classnames'
import Badge from 'components/badge'
import { BadgeProps } from 'components/badge/types'
import Tooltip from 'components/tooltip'
import s from './badge-list.module.css'

export interface Badge {
	text: BadgeProps['text']
	icon?: BadgeProps['icon']
	color?: BadgeProps['color']
	tooltip?: string
}

interface BadgeListProps {
	badges: Array<Badge>
	className?: string
	size?: BadgeProps['size']
	type?: BadgeProps['type']
}

export default function BadgeList({
	badges,
	className,
	size = 'medium',
	type = 'filled',
}: BadgeListProps) {
	return (
		<ul className={classNames(s.badgeList, className)}>
			{badges.map((badge: Badge) => {
				return (
					<li key={badge.text} className={s.badge}>
						{badge.tooltip ? (
							<Tooltip label={badge.tooltip}>
								<Badge
									icon={badge.icon}
									text={badge.text}
									color={badge.color}
									type={type}
									size={size}
								/>
							</Tooltip>
						) : (
							<Badge
								icon={badge.icon}
								text={badge.text}
								color={badge.color}
								type={type}
								size={size}
							/>
						)}
					</li>
				)
			})}
		</ul>
	)
}

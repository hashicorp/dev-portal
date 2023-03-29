/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Badge from 'components/badge'
import Tooltip from 'components/tooltip'
import s from './badge-list.module.css'
import { Badge as BadgeListBadge, BadgeListProps } from './types'

export default function BadgeList({
	badges,
	className,
	size = 'medium',
	type = 'filled',
}: BadgeListProps) {
	return (
		<ul className={classNames(s.badgeList, className)}>
			{badges.map((badge: BadgeListBadge) => {
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

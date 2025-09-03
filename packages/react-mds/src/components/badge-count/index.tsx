import classNames from 'classnames'
import type { HTMLAttributes } from 'react'
import s from './style.module.scss'

interface BadgeCountProps extends HTMLAttributes<HTMLDivElement> {
	size?: 'small' | 'medium' | 'large'
	type?: 'filled' | 'inverted' | 'outlined'
	color?: 'neutral' | 'neutral-dark-mode'
	/**
	 * Text value that renders in the Badge Count.
	 */
	text: string
}

const BadgeCount = ({
	text,
	size = 'medium',
	type = 'filled',
	color = 'neutral',
	className,
	...rest
}: BadgeCountProps) => {
	return (
		<div
			className={classNames(
				s['badge-count'],
				s[`size-${size}`],
				s[`type-${type}`],
				s[`color-${color}`],
				className
			)}
			{...rest}
		>
			{text}
		</div>
	)
}

export type { BadgeCountProps }
export { BadgeCount }

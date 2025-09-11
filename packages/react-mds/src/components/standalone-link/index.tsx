import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { Interactive, InteractiveProps } from '../interactive'
import { FlightIcon } from '../flight-icon'
import s from './styles.module.scss'

const STANDALONE_LINK_SIZES = ['small', 'medium', 'large'] as const
type StandaloneLinkSize = (typeof STANDALONE_LINK_SIZES)[number]

const STANDALONE_LINK_COLORS = [
	'primary',
	'secondary',
	'secondary-inverted',
] as const
type StandaloneLinkColor = (typeof STANDALONE_LINK_COLORS)[number]

const STANDALONE_LINK_ICON_POSITIONS = ['leading', 'trailing'] as const
type StandaloneLinkIconPosition =
	(typeof STANDALONE_LINK_ICON_POSITIONS)[number]

interface StandaloneLinkProps extends Omit<InteractiveProps, 'color' | 'size'> {
	text: string
	size?: StandaloneLinkSize
	color?: StandaloneLinkColor
	icon?: string
	iconPosition?: StandaloneLinkIconPosition
	href?: string
	locale?: string
	isHrefExternal?: boolean
	onClick?: () => void
	className?: string
	'data-testid'?: string
}

const StandaloneLink = forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	StandaloneLinkProps
>(
	(
		{
			text,
			size = 'medium',
			color = 'primary',
			icon,
			iconPosition = 'leading',
			className,
			'data-testid': dataTestId,
			locale,
			...props
		},
		ref
	) => {
		const iconElement = icon && <FlightIcon name={icon} size={16} />

		return (
			<Interactive
				{...props}
				ref={ref}
				className={classNames(
					s['standalone-link'],
					s[`size-${size}`],
					s[`color-${color}`],
					s[`icon-position-${iconPosition}`],
					className
				)}
				data-testid={dataTestId}
				locale={locale}
			>
				{iconElement && iconPosition === 'leading' && iconElement}
				<span className={s.text}>{text}</span>
				{iconElement && iconPosition === 'trailing' && iconElement}
			</Interactive>
		)
	}
)

StandaloneLink.displayName = 'StandaloneLink'

export type {
	StandaloneLinkSize,
	StandaloneLinkColor,
	StandaloneLinkIconPosition,
	StandaloneLinkProps,
}
export {
	STANDALONE_LINK_SIZES,
	STANDALONE_LINK_COLORS,
	STANDALONE_LINK_ICON_POSITIONS,
	StandaloneLink,
}

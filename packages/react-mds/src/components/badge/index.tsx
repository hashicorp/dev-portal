import classNames from 'classnames'
import { FlightIcon, FlightIconName, FlightIconSize } from '../flight-icon'
import s from './style.module.scss'

const BADGE_SIZES = ['small', 'medium', 'large'] as const
type BadgeSize = (typeof BADGE_SIZES)[number]

const BADGE_TYPES = ['filled', 'inverted', 'outlined'] as const
type BadgeType = (typeof BADGE_TYPES)[number]

const BADGE_COLORS = [
	'neutral',
	'neutral-dark-mode',
	'highlight',
	'success',
	'warning',
	'critical',
] as const
type BadgeColor = (typeof BADGE_COLORS)[number]

const ICON_SIZE_MAP = {
	small: 12,
	medium: 16,
	large: 16,
} as const satisfies Record<'small' | 'medium' | 'large', FlightIconSize>

interface BadgeProps {
	/** Use this parameter to show an icon. */
	icon?: FlightIconName

	/**
	 * The `iconColor` prop can be used to change the icon color. It works by setting
	 * the value of the icon SVG’s fill property.
	 */
	iconColor?: string

	/** This indicates if the button will only contain an icon. An internal check is in place to ensure that accessible text is still applied to the component. */
	iconOnly?: boolean

	/** The text of the Badge or value of the screen-reader only element if isIconOnly is set to true. If no text value is defined an error will be thrown. */
	text: string

	size?: BadgeSize
	type?: BadgeType
	color?: BadgeColor
	className?: string
}

const Badge = ({
	icon,
	iconColor,
	iconOnly,
	text,
	size = 'medium',
	type = 'filled',
	color = 'neutral',
	className,
	...rest
}: BadgeProps) => {
	return (
		<div
			className={classNames(
				s.badge,
				s[`size-${size}`],
				s[`type-${type}`],
				s[`color-${color}`],
				className
			)}
			{...rest}
		>
			{icon && (
				<FlightIcon name={icon} color={iconColor} size={ICON_SIZE_MAP[size]} />
			)}
			{iconOnly && icon ? (
				<span className="sr-only">{text}</span>
			) : (
				<div className={s.text}>{text}</div>
			)}
		</div>
	)
}

export type { BadgeProps, BadgeColor, BadgeSize, BadgeType }
export { Badge, BADGE_COLORS, BADGE_SIZES, BADGE_TYPES }

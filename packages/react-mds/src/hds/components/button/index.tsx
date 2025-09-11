import { forwardRef, ForwardRefExoticComponent } from 'react'
import classNames from 'classnames'
import { Interactive } from '../../../components/interactive'
import type { FlightIconSize } from '../../../components/flight-icon'
import { FlightIcon } from '../../../components/flight-icon'
import s from './styles.module.scss'

export const BUTTON_SIZES = ['small', 'medium', 'large'] as const
export type ButtonSize = (typeof BUTTON_SIZES)[number]

export const BUTTON_ICON_POSITIONS = ['leading', 'trailing'] as const
export type ButtonIconPosition = (typeof BUTTON_ICON_POSITIONS)[number]

export const BUTTON_COLORS = [
	'primary',
	'primary-black',
	'primary-white',
	'secondary', // deprecated; maps to secondary-white
	'secondary-high-contrast', // alternates based on theme
	'secondary-white',
	'secondary-black',
	'tertiary',
	'critical',
	'boundary',
	'consul',
	'nomad',
	'packer',
	'terraform',
	'vagrant',
	'vault',
	'waypoint',
	'hashicorp', // alias to primary
] as const
export type ButtonColor = (typeof BUTTON_COLORS)[number]

// These are the only “real” colors our legacy button knows about
const LEGACY_COLORS = [
	'primary',
	'secondary',
	'tertiary',
	'critical',
	'custom',
] as const
type LegacyButtonColor = (typeof LEGACY_COLORS)[number]

// map HDS “super-set” colors down to our legacy ones
const COLOR_MAP: Record<ButtonColor, LegacyButtonColor> = {
	primary: 'primary',
	'primary-black': 'custom',
	'primary-white': 'custom',
	secondary: 'custom',
	'secondary-high-contrast': 'custom',
	'secondary-white': 'custom',
	'secondary-black': 'custom',
	tertiary: 'tertiary',
	critical: 'critical',
	boundary: 'custom',
	consul: 'custom',
	nomad: 'custom',
	packer: 'custom',
	terraform: 'custom',
	vagrant: 'custom',
	vault: 'custom',
	waypoint: 'custom',
	hashicorp: 'primary',
}

interface LegacyButtonProps {
	size?: ButtonSize
	color?: LegacyButtonColor
	isFullWidth?: boolean
	isIconOnly?: boolean
	icon?: string
	iconPosition?: ButtonIconPosition
	text?: string
	href?: string
	isHrefExternal?: boolean
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	className?: string
	locale?: string
	disabled?: boolean
	autoFocus?: boolean
	type?: 'button' | 'submit' | 'reset'
}

const ICON_SIZE_MAP = {
	small: 12,
	medium: 16,
	large: 24,
} as const satisfies Record<'small' | 'medium' | 'large', FlightIconSize>

const LegacyButton = forwardRef<HTMLButtonElement, LegacyButtonProps>(
	(
		{
			size = 'medium',
			color = 'primary',
			isFullWidth,
			isIconOnly,
			icon,
			iconPosition = 'leading',
			text,
			href,
			isHrefExternal,
			className,
			locale,
			...rest
		},
		ref
	) => {
		const hasIcon = Boolean(icon)
		const showIconOnly = isIconOnly && hasIcon

		const iconElement = icon && (
			<FlightIcon name={icon} size={ICON_SIZE_MAP[size]} />
		)

		return (
			<Interactive
				className={classNames(
					s.button,
					s[`size-${size}`],
					{
						[s['width-full']]: isFullWidth,
						[s['icon-only']]: showIconOnly,
					},
					color !== 'custom' && s[`color-${color}`],
					className
				)}
				href={rest.disabled ? '' : href}
				isHrefExternal={isHrefExternal}
				aria-label={showIconOnly ? text : undefined}
				locale={locale}
				{...rest}
				ref={ref}
			>
				{showIconOnly && icon ? (
					iconElement
				) : (
					<>
						{icon && iconPosition === 'leading' && iconElement}
						<div className={s.text}>{text}</div>
						{icon && iconPosition === 'trailing' && iconElement}
					</>
				)}
			</Interactive>
		)
	}
)
LegacyButton.displayName = 'LegacyButton'

export interface HDSButtonProps extends Omit<LegacyButtonProps, 'color'> {
	color?: ButtonColor
}

export const HDSButton = forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	HDSButtonProps
>(({ color = 'primary', className, ...rest }, ref) => {
	const legacyColor = COLOR_MAP[color]

	const remappedColors: Partial<Record<ButtonColor, ButtonColor>> = {
		hashicorp: 'primary',
		secondary: 'secondary-white',
	}

	const customClass =
		legacyColor === 'custom'
			? s[`color-${remappedColors[color] ?? color}`]
			: undefined

	return (
		<LegacyButton
			{...rest}
			color={legacyColor}
			className={classNames(customClass, className)}
			ref={ref as ForwardRefExoticComponent<HTMLButtonElement>}
		/>
	)
})

HDSButton.displayName = 'HDSButton'

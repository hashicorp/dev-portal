import classNames from 'classnames'
import { Badge } from '../../badge'
import { BadgeCount } from '../../badge-count'
import { Toggle } from '../../menu-primitive'
import { useMenuPrimitive } from '../../menu-primitive/use-menu-primitive'
import { FlightIcon, FlightIconName } from '../../flight-icon'
import type { ButtonHTMLAttributes } from 'react'
import s from './styles.module.scss'

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Text of the ToggleButton. If no text value is defined, an error will be thrown.
	 */
	text: string
	color?: 'primary' | 'secondary'
	size?: 'small' | 'medium'
	icon?: string
	isFullWidth?: boolean
	/**
	 * Displays an optional count indicator using the Badge Count component.
	 */
	count?: string
	/**
	 * Displays an optional badge indicator using the Badge component.
	 */
	badge?: string
	/**
	 * Appends an icon to the optional badge indicator.
	 */
	badgeIcon?: FlightIconName
}

const ToggleButton = ({
	text,
	color = 'primary',
	size = 'medium',
	icon,
	isFullWidth,
	count,
	badge,
	badgeIcon,
	disabled,
	...rest
}: ToggleButtonProps) => {
	const { isOpen, onClickToggle } = useMenuPrimitive()
	const badgeType = color === 'primary' || disabled ? 'filled' : 'inverted'
	const iconSize = size === 'small' ? 12 : 16

	return (
		<Toggle>
			<button
				aria-expanded={isOpen}
				type="button"
				className={classNames(
					s['toggle-button'],
					s[`size-${size}`],
					s[`color-${color}`],
					{
						[s['width-full']]: isFullWidth,
					}
				)}
				onClick={onClickToggle}
				disabled={disabled}
				{...rest}
			>
				{icon && <FlightIcon name={icon} size={iconSize} />}
				<div className={s.text}>{text}</div>
				{count && <BadgeCount text={count} size="small" type={badgeType} />}
				{badge && (
					<Badge text={badge} icon={badgeIcon} size="small" type={badgeType} />
				)}
				<Chevron />
			</button>
		</Toggle>
	)
}

ToggleButton.displayName = 'Dropdown.ToggleButton'

const Chevron = () => {
	return <FlightIcon name="chevron-down" isInlineBlock={false} />
}

export type { ToggleButtonProps }
export { ToggleButton }

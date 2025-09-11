import classNames from 'classnames'
import { FlightIcon } from '../../flight-icon'
import { Interactive, type InteractiveProps } from '../../interactive'
import s from './styles.module.css'

interface ListItemInteractiveProps extends Omit<InteractiveProps, 'children'> {
	/**
	 * Text to be used in the item. If no text value is defined, an error will be thrown.
	 */
	text: string
	/**
	 * Color applied to the text and (optional) icons.
	 */
	color?: 'action' | 'critical'
	/**
	 * Leading icon. Acceptable value: any [icon](https://helios.hashicorp.design/icons/library) name.
	 */
	icon?: string
	/**
	 * Trailing icon. Acceptable value: any [icon](https://helios.hashicorp.design/icons/library) name.
	 */
	trailingIcon?: string
	/**
	 * Controls if the item is in “loading” state. When in this state, the item is not actually interactive, but you can pass the other expected arguments for the item (they’re simply ignored).
	 */
	isLoading?: boolean
}

const ListItemInteractive = ({
	text,
	color = 'action',
	icon,
	isLoading,
	trailingIcon,
	...rest
}: ListItemInteractiveProps) => {
	return (
		<li
			className={classNames(s['list-item'], s.interactive, s[`color-${color}`])}
		>
			{isLoading ? (
				<div className={s['loading-wrapper']}>
					<FlightIcon
						name="loading"
						className={classNames(s['interactive-icon'], s.leading)}
					/>
					<div className={classNames(s['interactive-text'], s['text-regular'])}>
						{text}
					</div>
				</div>
			) : (
				<Interactive {...rest}>
					{icon && (
						<FlightIcon
							name={icon}
							className={classNames(s['interactive-icon'], s.leading)}
						/>
					)}
					<div className={classNames(s['interactive-text'], s['text-large'])}>
						{text}
					</div>
					{trailingIcon && (
						<FlightIcon
							name={trailingIcon}
							className={classNames(s['interactive-icon'], s.trailing)}
						/>
					)}
				</Interactive>
			)}
		</li>
	)
}

ListItemInteractive.displayName = 'Dropdown.ListItem.Interactive'

export type { ListItemInteractiveProps }
export { ListItemInteractive }

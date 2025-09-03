//design-system-components@4.4.1

import classNames from 'classnames'
import { useId } from 'react'
import { Badge } from '../../badge'
import { FlightIcon } from '../../flight-icon'
import { RadioBase } from '../radio'
import RadioCardGroup from './group'
import Label from './label'
import Description from './description'
import type { HTMLProps, ReactNode } from 'react'
import type { BadgeProps } from '../../badge'
import s from './form-radio-card.module.css'

export const DEFAULT_CONTROL_POSITION = 'bottom'
export const DEFAULT_ALIGNMENT = 'left'
export const CONTROL_POSITIONS = ['bottom', 'left'] as const
export const ALIGNMENTS = ['left', 'center'] as const

interface RadioCardProps {
	/**
	 * Sets the position of the form control in relation to the Radio Card content.
	 */
	controlPosition?: (typeof CONTROL_POSITIONS)[number]
	/**
	 * Sets the alignment of the Radio Card content.
	 */
	alignment?: (typeof ALIGNMENTS)[number]
	/**
	 * any valid CSS width (%, vw, etc)
	 * This parameter will set the width of the card, wrapping cards on multiple rows if necessary.
	 * You can use it to define the number of Radio Cards shown per row (for example `25%`
	 * will result in 4 cards).
	 */
	maxWidth?: `${number}px` | `${number}vw` | `${number}%`
	/**
	 * Renders <Badge /> component.
	 */
	badges?: Array<BadgeProps>
	/**
	 * The name of the flight icon to render.
	 */
	icon?: string
	/**
	 * The label text.
	 */
	label?: string
	/**
	 * The description text.
	 */
	description?: string
	/*
	 * Optional children rendered below the label and description (if provided).
	 */
	children?: ReactNode
	field: HTMLProps<HTMLInputElement>
	id?: string
}

const RadioCard = ({
	controlPosition = DEFAULT_CONTROL_POSITION,
	alignment = DEFAULT_ALIGNMENT,
	maxWidth,
	field,
	icon,
	label,
	description,
	badges,
	children,
}: RadioCardProps) => {
	const generatedId = useId()

	return (
		<label
			htmlFor={generatedId}
			style={{ maxWidth }}
			className={classNames(
				s['radio-card'],
				s[`control-${controlPosition}`],
				s[`align-${alignment}`],
				{
					[s['checked']]: field.checked,
					[s['disabled']]: field.disabled,
					[s['has-fixed-width']]: maxWidth,
					[s['has-fluid-width']]: !maxWidth,
				}
			)}
		>
			<span className={s['content']}>
				{icon && (
					<FlightIcon
						name={icon}
						size={24}
						isInlineBlock={false}
						className={classNames({
							[s['icon-center']]: alignment === 'center',
						})}
					/>
				)}
				{label && <Label label={label} />}
				{badges?.length ? (
					<div className={s.badges}>
						{badges.map((badge) => (
							<Badge {...badge} key={badge.text} />
						))}
					</div>
				) : null}
				{description && <Description description={description} />}
				{children}
			</span>
			<span className={s['control-wrapper']}>
				<RadioBase className={s.control} id={generatedId} field={field} />
			</span>
		</label>
	)
}

export { RadioCardGroup, RadioCard }

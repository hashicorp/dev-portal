import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classnames'
import { ButtonProps } from './types'
import s from './button.module.css'

// eslint-disable-next-line react/display-name
const Button = forwardRef(
	(
		{
			'aria-controls': ariaControls,
			'aria-describedby': ariaDescribedBy,
			'aria-expanded': ariaExpanded,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			className,
			color = 'primary',
			'data-heap-track': dataHeapTrack,
			disabled,
			form,
			icon,
			iconPosition = 'leading',
			id,
			isFullWidth,
			name,
			onClick,
			size = 'medium',
			text,
			type = 'button',
		}: ButtonProps,
		ref: ForwardedRef<HTMLButtonElement>
	) => {
		const classes = classNames(
			s.root,
			s[size],
			s[color],
			{
				[s.fullWidth]: isFullWidth,
			},
			className
		)
		const hasIcon = !!icon
		const hasText = !!text
		const hasLabel = !!ariaLabel || !!ariaLabelledBy || !!ariaDescribedBy
		const hasLeadingIcon = hasIcon && iconPosition === 'leading'
		const hasTrailingIcon = hasIcon && iconPosition === 'trailing'
		const isIconOnly = hasIcon && !hasText

		if (!hasIcon && !hasText) {
			throw new Error(
				'`Button` must have either `text` or an `icon` with accessible labels.'
			)
		}

		if (isIconOnly && !hasLabel) {
			throw new Error(
				'Icon-only `Button`s require an accessible label. Either provide the `text` prop or one of: `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy`.'
			)
		}

		if (ariaLabel && ariaLabelledBy) {
			throw new Error(
				'`Button` does not accept both `ariaLabel` and `ariaLabelledBy`. Only provide one or the other.'
			)
		}

		return (
			<button
				aria-controls={ariaControls}
				aria-describedby={ariaDescribedBy}
				aria-expanded={ariaExpanded}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				className={classes}
				data-heap-track={dataHeapTrack}
				disabled={disabled}
				form={form}
				id={id}
				name={name}
				onClick={onClick}
				ref={ref}
				type={type}
			>
				{hasLeadingIcon && icon}
				{hasText && <span className={s.text}>{text}</span>}
				{hasTrailingIcon && icon}
			</button>
		)
	}
)

export type { ButtonProps }
export default Button

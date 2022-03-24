import { ButtonProps } from './types'
import s from './button.module.css'
import classNames from 'classnames'

const Button = ({
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  color = 'primary',
  disabled,
  icon,
  iconPosition = 'leading',
  isFullWidth,
  onClick,
  size = 'medium',
  text,
  type = 'button',
}: ButtonProps) => {
  const className = classNames(s.root, s[size], s[color], {
    [s.fullWidth]: isFullWidth,
  })
  const hasIcon = !!icon
  const hasLeadingIcon = hasIcon && iconPosition === 'leading'
  const hasTrailingIcon = hasIcon && iconPosition === 'trailing'
  const hasText = !!text
  const hasLabel = !!ariaLabel || !!ariaLabelledBy || !!ariaDescribedBy

  if (!hasIcon && !hasText) {
    throw new Error(
      '`Button` must have either `text` or an `icon` with accessible labels.'
    )
  }

  if (hasIcon && !hasLabel) {
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
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {hasLeadingIcon && icon}
      {hasText && <span className={s.text}>{text}</span>}
      {hasTrailingIcon && icon}
    </button>
  )
}

export type { ButtonProps }
export default Button

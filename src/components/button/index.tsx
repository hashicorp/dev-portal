import { ButtonProps } from './types'
import s from './button.module.css'
import classNames from 'classnames'

const Button = ({
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
  const hasLeadingIcon = icon && iconPosition === 'leading'
  const hasTrailingIcon = icon && iconPosition === 'trailing'

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {hasLeadingIcon && icon}
      <span className={s.text}>{text}</span>
      {hasTrailingIcon && icon}
    </button>
  )
}

export type { ButtonProps }
export default Button

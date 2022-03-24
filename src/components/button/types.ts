import { ReactElement } from 'react'

type ButtonElementProps = JSX.IntrinsicElements['button']

// TODO: add jsdoc to each prop
export type ButtonProps = Pick<
  ButtonElementProps,
  'disabled' | 'onClick' | 'type'
> & {
  ariaLabel?: ButtonElementProps['aria-label']
  ariaLabelledBy?: ButtonElementProps['aria-labelledby']
  ariaDescribedBy?: ButtonElementProps['aria-describedby']
  color?: 'primary' | 'secondary' | 'tertiary' | 'critical'
  icon?: ReactElement
  iconPosition?: 'leading' | 'trailing'
  isFullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  text?: string
}

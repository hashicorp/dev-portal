import { ReactElement } from 'react'

type ButtonElementProps = JSX.IntrinsicElements['button']

export type ButtonProps = Pick<
  ButtonElementProps,
  'disabled' | 'onClick' | 'type'
> & {
  color?: 'primary' | 'secondary' | 'tertiary' | 'critical'
  icon?: ReactElement
  iconPosition?: 'leading' | 'trailing'
  isFullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  text: string
}

type ButtonElementProps = JSX.IntrinsicElements['button']

export type ButtonProps = Pick<ButtonElementProps, 'onClick' | 'type'> & {
  text: string
}

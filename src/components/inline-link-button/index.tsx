import { ReactElement } from 'react'
import classNames from 'classnames'
import { InlineLinkButtonProps } from './types'
import s from './inline-link-button.module.css'

function InlineLinkButton({
  className,
  children,
  ...rest
}: InlineLinkButtonProps): ReactElement {
  return (
    <button className={classNames(s.root, className)} {...rest}>
      {children}
    </button>
  )
}

export type { InlineLinkButtonProps }
export default InlineLinkButton

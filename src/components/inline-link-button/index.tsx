import { ReactElement } from 'react'
import classNames from 'classnames'
import { InlineLinkButtonProps } from './types'
import s from './inline-link-button.module.css'

/**
 * A <button> version of "components/inline-link",
 * to support onClick navigation actions such as window.history.back()
 */
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

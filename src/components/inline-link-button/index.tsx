import { ReactElement } from 'react'
import classNames from 'classnames'
import { InlineLinkButtonProps } from './types'
import s from './inline-link-button.module.css'

function InlineLinkButton({
  className,
  text,
  ...rest
}: InlineLinkButtonProps): ReactElement {
  return (
    <button className={classNames(s.root, className)} {...rest}>
      {text}
    </button>
  )
}

export type { InlineLinkButtonProps }
export default InlineLinkButton

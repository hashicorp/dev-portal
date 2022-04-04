import { ReactElement } from 'react'
import classNames from 'classnames'
import { DevDotContentProps } from './types'
import s from './dev-dot-content.module.css'
import sAlerts from './custom-alert-boxes.module.css'

const DevDotContent = ({
  className,
  children,
}: DevDotContentProps): ReactElement => {
  return (
    <div className={classNames(s.root, sAlerts.root, className)}>
      {children}
    </div>
  )
}

export default DevDotContent

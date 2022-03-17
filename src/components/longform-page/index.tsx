import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './style.module.css'

interface LongformPageProps {
  className?: string
  title?: string
  alert?: ReactNode
  children: ReactNode
}

export default function LongformPage({
  className,
  title,
  alert,
  children,
}: LongformPageProps): ReactElement {
  return (
    <div className={classNames(styles.longformPage, className)}>
      <div className="g-grid-container">
        <div className={styles.longformWrapper}>
          {alert && <div className={styles.alert}>{alert}</div>}
          <h2 className="g-type-display-2">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}

import classNames from 'classnames'
import { ToastColor, ToastDisplayProps } from './types'
import CloseButton from '../close-button'
import s from './toast-display.module.css'

/**
 * Display component for use with a toast library,
 * such as react-hot-toast.
 */
function ToastDisplay({
  title,
  description,
  color = ToastColor.neutral,
  icon,
  children,
  actions,
  onDismiss,
}: ToastDisplayProps) {
  return (
    <div className={classNames(s.root, s[`color-${color}`])}>
      {icon ? <div className={s.iconArea}>{icon}</div> : null}
      <div className={s.contentArea}>
        {children ? (
          children
        ) : (
          <>
            {title ? <p className={s.title}>{title}</p> : null}
            {description ? (
              <p className={s.description}>{description}</p>
            ) : null}
            {actions ? <div className={s.actions}>{actions}</div> : null}
          </>
        )}
      </div>
      <div className={s.closeArea}>
        <CloseButton onClick={onDismiss} ariaLabel="Dismiss notification" />
      </div>
    </div>
  )
}

export default ToastDisplay

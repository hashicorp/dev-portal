import classNames from 'classnames'
import { ToastColor, ToastDisplayProps } from './types'
import CloseButton from '@hashicorp/react-close-button'
import s from './toast-display.module.css'

function ToastDisplay({
  title,
  description,
  color = ToastColor.neutral,
  onDismiss,
}: ToastDisplayProps) {
  return (
    <div className={classNames(s.root, s[`color-${color}`])}>
      <div className={s.iconArea}>
        <div className={s.icon}>{'[ICON]'}</div>
      </div>
      <div className={s.contentArea}>
        <p className={s.title}>{title}</p>
        <p className={s.description}>{description}</p>
      </div>
      <div className={s.closeArea}>
        <CloseButton onClick={onDismiss} ariaLabel="Dismiss notification" />
      </div>
    </div>
  )
}

export default ToastDisplay

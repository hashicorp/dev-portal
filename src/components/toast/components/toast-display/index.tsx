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
  renderActions,
  dismissSelf,
}: ToastDisplayProps) {
  /**
   * In development, throw an error if a toast has
   * no title and no description (except when using custom content).
   */
  if (!title && !description && !children) {
    throw new Error(
      `Toast must be provided either a "title" or a "description", or you must use "children" to render custom content in the Toast. Please ensure toast has a non-empty string for its "title" or "description", or provide custom "children" content to render.`
    )
  }

  const DescriptionElem =
    typeof description === 'string' ? 'p' : description ? 'div' : null

  return (
    <div className={classNames(s.root, s[`color-${color}`])}>
      {icon ? <div className={s.iconArea}>{icon}</div> : null}
      <div className={s.contentArea}>
        {title ? <p className={s.title}>{title}</p> : null}
        {description ? (
          <DescriptionElem className={s.description}>
            {description}
          </DescriptionElem>
        ) : null}
        {children ? children : null}
        {typeof renderActions == 'function' ? (
          <div className={s.actions}>{renderActions({ dismissSelf })}</div>
        ) : null}
      </div>
      <div className={s.closeArea}>
        <CloseButton onClick={dismissSelf} ariaLabel="Dismiss notification" />
      </div>
    </div>
  )
}

export default ToastDisplay

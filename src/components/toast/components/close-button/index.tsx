import classNames from 'classnames'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import type { CloseButtonProps } from './types'
import s from './close-button.module.css'

/**
 * "X" button, for closing modals and toasts, for example.
 * Mostly duplicative of @hashicorp/react-close-button.
 */
export default function CloseButton({
  className,
  onClick,
  ariaLabel,
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(s.closeButton, className)}
      aria-label={ariaLabel}
    >
      <IconX16 />
    </button>
  )
}

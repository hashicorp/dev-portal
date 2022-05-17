import { DialogOverlay, DialogContent } from '@reach/dialog'
import { DialogProps } from './types'
import s from './dialog.module.css'

export default function Dialog({
  children,
  isOpen,
  onDismiss,
  label,
}: DialogProps) {
  return (
    <DialogOverlay className={s.overlay} isOpen={isOpen} onDismiss={onDismiss}>
      <DialogContent className={s.content} aria-label={label}>
        {children}
      </DialogContent>
    </DialogOverlay>
  )
}

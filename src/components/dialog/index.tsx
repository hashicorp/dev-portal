import { DialogOverlay, DialogContent } from '@reach/dialog'
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion'
import { DialogProps } from './types'
import s from './dialog.module.css'

export default function Dialog({
  children,
  isOpen,
  onDismiss,
  label,
}: DialogProps) {
  const shouldReduceMotion = useReducedMotion()
  const AnimatedDialogOverlay = motion(DialogOverlay)

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedDialogOverlay
          animate={{ opacity: 1 }}
          className={s.animatedDialogOverlay}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          isOpen={isOpen}
          onDismiss={onDismiss}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <div className={s.contentWrapper}>
            <DialogContent className={s.content} aria-label={label}>
              {children}
            </DialogContent>
          </div>
        </AnimatedDialogOverlay>
      )}
    </AnimatePresence>
  )
}

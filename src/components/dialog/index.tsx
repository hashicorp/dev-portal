import { DialogOverlay, DialogContent } from '@reach/dialog'
import { AnimatePresence, m } from 'framer-motion'
import { DialogProps } from './types'
import s from './dialog.module.css'

export default function Dialog({
  children,
  isOpen,
  onDismiss,
  label,
}: DialogProps) {
  const AnimatedDialogOverlay = m(DialogOverlay)
  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedDialogOverlay
          className={s.animatedDialogOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDismiss={onDismiss}
        >
          <DialogOverlay
            className={s.dialogOverlay}
            isOpen={isOpen}
            onDismiss={onDismiss}
          >
            <m.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              transition={{ min: 0, max: 100, bounceDamping: 8 }}
            >
              <div className={s.contentWrapper}>
                <DialogContent className={s.content} aria-label={label}>
                  {children}
                </DialogContent>
              </div>
            </m.div>
          </DialogOverlay>
        </AnimatedDialogOverlay>
      )}
    </AnimatePresence>
  )
}

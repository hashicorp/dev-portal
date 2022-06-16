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
          animate={{ opacity: 1 }}
          className={s.animatedDialogOverlay}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          isOpen={isOpen}
          onDismiss={onDismiss}
        >
          <m.div
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            initial={{ y: 50 }}
            transition={{ min: 0, max: 100, bounceDamping: 8 }}
          >
            <div className={s.contentWrapper}>
              <DialogContent className={s.content} aria-label={label}>
                {children}
              </DialogContent>
            </div>
          </m.div>
        </AnimatedDialogOverlay>
      )}
    </AnimatePresence>
  )
}

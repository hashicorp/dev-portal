import { DialogOverlay, DialogContent } from '@reach/dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { DialogProps } from './types'
import s from './dialog.module.css'

export default function Dialog({
  children,
  isOpen,
  onDismiss,
  label,
}: DialogProps) {
  const AnimatedDialogOverlay = motion(DialogOverlay)
  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedDialogOverlay
          className={s.dialogOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDismiss={onDismiss}
        >
          <DialogOverlay
            className={s.overlay}
            isOpen={isOpen}
            onDismiss={onDismiss}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              transition={{ min: 0, max: 100, bounceDamping: 8 }}
            >
              <DialogContent className={s.content} aria-label={label}>
                {children}
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </AnimatedDialogOverlay>
      )}
    </AnimatePresence>
  )
}

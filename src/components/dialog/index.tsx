import * as React from 'react'
import { DialogOverlay, DialogContent, DialogOverlayProps } from '@reach/dialog'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { AnimatePresence, motion } from 'framer-motion'
import s from './dialog.module.css'

export type DialogProps = DialogOverlayProps & {
  label: string
}

export default function Dialog({
  isOpen,
  onDismiss,
  children,
  label,
}: DialogProps): React.ReactElement {
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
          <div className={s.dialogWrapper}>
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              transition={{ min: 0, max: 100, bounceDamping: 8 }}
            >
              <DialogContent className={s.dialogContent} aria-label={label}>
                <button onClick={onDismiss} className={s.dialogClose}>
                  <IconX16 />
                </button>
                {children}
              </DialogContent>
            </motion.div>
          </div>
        </AnimatedDialogOverlay>
      )}
    </AnimatePresence>
  )
}

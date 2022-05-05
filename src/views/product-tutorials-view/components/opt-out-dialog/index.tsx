import { DialogOverlay, DialogContent } from '@reach/dialog'
import { ReactNode } from 'react'

interface DialogProps {
  isOpen: boolean
  onDismiss(): void
  children: ReactNode
}

export default function Dialog({ children, isOpen, onDismiss }: DialogProps) {
  return (
    <DialogOverlay
      style={{ background: 'hsla(0, 100%, 100%, 0.9)', zIndex: 100 }}
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <DialogContent
        style={{ boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)' }}
      >
        {children}
      </DialogContent>
    </DialogOverlay>
  )
}

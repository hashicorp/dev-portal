import { DialogOverlay, DialogContent } from '@reach/dialog'
import { ReactNode } from 'react'

interface DialogProps {
  isOpen: boolean
  onDismiss(): void
  children: ReactNode
}

const overlayStyles = {
  background: 'var(--token-color-border-strong',
  zIndex: 100,
}

const dialogStyles = {
  boxShadow: 'var(--token-surface-higher-box-shadow)',
  borderRadius: '6px',
  padding: '24px',
}

export default function Dialog({ children, isOpen, onDismiss }: DialogProps) {
  return (
    <DialogOverlay style={overlayStyles} isOpen={isOpen} onDismiss={onDismiss}>
      <DialogContent style={dialogStyles}>{children}</DialogContent>
    </DialogOverlay>
  )
}

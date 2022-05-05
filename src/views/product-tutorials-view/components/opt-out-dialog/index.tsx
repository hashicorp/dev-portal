import { DialogOverlay, DialogContent } from '@reach/dialog'
import { ReactNode } from 'react'

interface DialogProps {
  isOpen: boolean
  onDismiss(): void
  children: ReactNode
  label: string
}

const overlayStyles = {
  background: 'var(--token-color-border-strong',
  zIndex: 100,
}

const dialogStyles = {
  boxShadow: 'var(--token-surface-higher-box-shadow)',
  borderRadius: '6px',
  padding: '24px',
  maxWidth: '600px',
  minWidth: '300px',
}

export default function Dialog({
  children,
  isOpen,
  onDismiss,
  label,
}: DialogProps) {
  return (
    <DialogOverlay style={overlayStyles} isOpen={isOpen} onDismiss={onDismiss}>
      <DialogContent style={dialogStyles} aria-label={label}>
        {children}
      </DialogContent>
    </DialogOverlay>
  )
}

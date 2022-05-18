export interface DialogProps {
  isOpen: boolean
  onDismiss(): void
  children: React.ReactNode
  label: string
}

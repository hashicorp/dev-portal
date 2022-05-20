import { toast, ToastColor } from 'components/toast'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'

/**
 * Given a copiedState,
 * as well as an OS and optional package manager name,
 *
 * Display a "successful copy" toast if the copiedState state is true,
 * or a "failed to copy" toast if copiedState is false.
 *
 * If copiedState is "null" (as it is in its initial state),
 * this is fine, but it does not merit toast.
 */
export default function toastOnCopy(
  copiedState: boolean | null,
  prettyOsName: string,
  packageManagerLabel?: string
) {
  // Build a label like "Operating System (Package Manager)"
  let fullLabel = prettyOsName
  if (packageManagerLabel) {
    fullLabel += ` (${packageManagerLabel})`
  }
  // Make toast
  if (copiedState == true) {
    toast({
      icon: <IconCheckCircle24 />,
      color: ToastColor.success,
      title: 'Copied install command',
      description: `Install command for ${fullLabel} was copied to the clipboard.`,
    })
  } else if (copiedState == false) {
    toast({
      icon: <IconAlertTriangle24 />,
      color: ToastColor.warning,
      title: 'Failed to copy install command!',
    })
  }
}

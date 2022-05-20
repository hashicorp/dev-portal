import { toast, ToastColor } from 'components/toast'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'

/**
 * Given a copySuccess state,
 * as well as an OS and optional package manager name,
 *
 * Display a "successful copy" toast if the copySuccess state is true,
 * or a "failed to copy" toast if copySuccess is false.
 *
 * If copySuccess is "null" (as it is in its initial state),
 * this is fine, but it does not merit toast.
 */
export default function toastOnCopy(
  copySuccess: boolean | null,
  prettyOsName: string,
  packageManagerLabel?: string
) {
  // Build a label like "Operating System (Package Manager)"
  let fullLabel = prettyOsName
  if (packageManagerLabel) {
    fullLabel += ` (${packageManagerLabel})`
  }
  // Make toast
  if (copySuccess == true) {
    toast({
      icon: <IconCheckCircle24 />,
      color: ToastColor.success,
      title: 'Copied install command',
      description: `Install command for ${fullLabel} was copied to the clipboard.`,
    })
  } else if (copySuccess == false) {
    toast({
      icon: <IconAlertTriangle24 />,
      color: ToastColor.warning,
      title: 'Failed to copy install command!',
    })
  }
}

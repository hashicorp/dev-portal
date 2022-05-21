import { toast, ToastColor } from 'components/toast'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'
import Button from 'components/button'
import ButtonLink from 'components/button-link'
import StandaloneLink from 'components/standalone-link'
import { IconArrowUpRight16 } from '@hashicorp/flight-icons/svg-react/arrow-up-right-16'

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
  {
    prettyOSName,
    packageManagerLabel,
  }: {
    prettyOSName: string
    packageManagerLabel?: string
  },
  onDismissCallback?: () => void
) {
  // Build a label like "Operating System (Package Manager)"
  let fullLabel = prettyOSName
  if (packageManagerLabel) {
    fullLabel += ` (${packageManagerLabel})`
  }
  // Make toast
  if (copiedState == true) {
    toast({
      icon: <IconCheckCircle24 />,
      color: ToastColor.success,
      title: 'Copied install command',
      description: (
        <p>
          Install command for {fullLabel} was copied to the clipboard.
          Here&apos;s{' '}
          <a href="https://www.hashicorp.com">a docs link to click</a>.
        </p>
      ),
      actions: (
        <>
          <ButtonLink
            color="secondary"
            text="Download Vault"
            size="small"
            href="/vault/downloads"
          />
          <StandaloneLink
            color="primary"
            size="small"
            href="https://learn.hashicorp.com"
            icon={<IconArrowUpRight16 />}
            iconPosition="trailing"
            text="Leave beta or whatnot"
          />
        </>
      ),
      autoDismiss: false,
      isInteractive: true,
      onDismissCallback,
    })
  } else if (copiedState == false) {
    toast({
      icon: <IconAlertTriangle24 />,
      color: ToastColor.warning,
      title: 'Failed to copy install command!',
    })
  }
}
